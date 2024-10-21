import ApiError from '@/contracts/dto/error'
import { IUser } from '@/contracts/model/user'
import { JobTypeEnum } from '@/enums/queue'
import { Payment } from '@/models/payment'
import { paymentQueue } from '@/queue/paymentQueue'
import { transactionService } from '@/services/transactionService'
import { userService } from '@/services/userService'
import { StatusCodes } from 'http-status-codes'
import { Document, ObjectId } from 'mongoose'

export const paymentService = {
  create: async ({
    user,
    amount
  }: {
    user: Omit<IUser, 'id'> & Document
    amount: number
  }) => Payment.create({ userId: user.id, amount, status: 'pending' }),

  completePayment: async ({
    userId,
    paymentId
  }: {
    userId: ObjectId
    paymentId: ObjectId
  }) => {
    return await Payment.findOneAndUpdate(
      { _id: paymentId, userId },
      { status: 'completed' },
      { new: true }
    )
  },

  createPaymentFlow: async ({
    user,
    amount
  }: {
    user: Omit<IUser, 'id'> & Document
    amount: number
  }) => {
    const payment = await paymentService.create({ user, amount })
    const transaction = await transactionService.create({
      description: 'Balance top up',
      refId: payment.id,
      refType: 'Payment',
      amount,
      userId: user.id,
      direction: 'out',
      status: 'pending',
      operation: 'balanceTopUp',
      jobId: null,
      paymentId: null
    })

    const job = await paymentQueue.add(JobTypeEnum.TOPUP_BALANCE, {
      userId: user.id,
      transactionId: transaction.id,
      paymentId: payment.id
    })

    await transactionService.updateJobId({
      transactionId: transaction.id,
      jobId: job.id
    })
  },

  processPaymentFlow: async ({
    userId,
    transactionId,
    paymentId
  }: {
    userId: ObjectId
    transactionId: ObjectId
    paymentId: ObjectId
  }) => {
    const transaction = await transactionService.getById(transactionId)
    if (!transaction)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found')

    const payment = await Payment.findById(paymentId)
    if (!payment) throw new ApiError(StatusCodes.NOT_FOUND, 'Payment not found')

    await userService.topUpBalance({
      userId,
      amount: payment.amount
    })

    await transactionService.completeTransaction({ transactionId })

    await paymentService.completePayment({ userId, paymentId })
  }
}
