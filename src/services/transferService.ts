import ApiError from '@/contracts/dto/error'
import { IUser } from '@/contracts/model/user'
import { JobTypeEnum } from '@/enums/queue'
import logger from '@/infrastructure/logger'
import { Transfer } from '@/models/transfer'
import { paymentQueue } from '@/queue/paymentQueue'
import { transactionService } from '@/services/transactionService'
import { userService } from '@/services/userService'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongoose'

export const transferService = {
  getAll: async ({
    page,
    limit,
    userId
  }: {
    page: number
    limit: number
    userId: ObjectId
  }) =>
    Transfer.paginate({
      page,
      limit,
      query: { userId },
      populate: 'otherUserId'
    }),
  getById: async (transferId: ObjectId) => {
    return await Transfer.findById(transferId)
  },

  create: async ({
    userId,
    otherUserId,
    amount,
    status,
    direction
  }: {
    userId: ObjectId
    otherUserId: ObjectId
    amount: number
    status: string
    direction: string
  }) => {
    return await Transfer.create({
      userId,
      otherUserId,
      amount,
      status,
      direction
    })
  },

  createMany: async (transfers: Record<string, unknown>[]) => {
    return await Transfer.insertMany(transfers)
  },

  cancelTransfer: async (transferId: ObjectId) => {
    return await Transfer.findByIdAndUpdate(
      transferId,
      { status: 'cancelled' },
      { new: true }
    )
  },

  cancelTransferMany: async (transferIds: ObjectId[]) => {
    return await Transfer.updateMany(
      { _id: { $in: transferIds } },
      { status: 'cancelled' },
      { new: true }
    )
  },

  completeTransferMany: async (transferIds: ObjectId[]) => {
    return await Transfer.updateMany(
      { _id: { $in: transferIds } },
      { status: 'completed' },
      { new: true }
    )
  },

  completeTransfer: async (transferId: ObjectId) => {
    return await Transfer.findByIdAndUpdate(
      transferId,
      { status: 'completed' },
      { new: true }
    )
  },

  transferFunds: async ({
    user,
    otherUserId,
    amount
  }: {
    user: IUser
    otherUserId: ObjectId
    amount: number
  }) => {
    const toUser = await userService.getById(otherUserId)
    if (!toUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    const userBalance = await userService.hasEnoughBalance({
      userId: user.id,
      amount
    })
    if (!userBalance)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient balance')

    const transferFromQuery = {
      userId: user.id,
      otherUserId: toUser.id,
      amount,
      status: 'pending',
      direction: 'out'
    }
    const transferToQuery = {
      userId: otherUserId,
      otherUserId: user.id,
      amount,
      status: 'pending',
      direction: 'in'
    }
    const transfers = await transferService.createMany([
      transferFromQuery,
      transferToQuery
    ])

    const transactionFromQuery = {
      userId: user.id,
      refId: transfers[0].id,
      refType: 'Transfer',
      amount,
      direction: 'out',
      description: `Transfer to ${toUser.firstName} ${toUser.lastName}`,
      status: 'pending',
      operation: 'transfer',
      jobId: null,
      paymentId: null
    }

    const transactionToQuery = {
      userId: otherUserId,
      refId: transfers[1].id,
      refType: 'Transfer',
      amount,
      direction: 'in',
      description: `Transfer from ${user.firstName} ${user.lastName}`,
      status: 'pending',
      operation: 'transfer',
      jobId: null,
      paymentId: null
    }

    const transactions = await transactionService.createMany({
      transactions: [transactionFromQuery, transactionToQuery]
    })

    const job = await paymentQueue.add(JobTypeEnum.TRANSFER, {
      userId: user.id,
      transferFromId: transfers[0].id,
      transferToId: transfers[1].id,
      transactionFromId: transactions[0].id,
      transactionToId: transactions[1].id
    })

    await transactionService.updateManyJobId({
      transactionIds: [transactions[0].id, transactions[1].id],
      jobId: job.id
    })
  },

  transferFundsProcess: async ({
    userId,
    transferFromId,
    transferToId,
    transactionFromId,
    transactionToId
  }: {
    userId: ObjectId
    transferFromId: ObjectId
    transferToId: ObjectId
    transactionFromId: ObjectId
    transactionToId: ObjectId
  }) => {
    try {
      const transactionFrom = await transactionService.getById(
        transactionFromId
      )
      const transactionTo = await transactionService.getById(transactionToId)
      if (!transactionFrom || !transactionTo)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found')

      const transferFrom = await transferService.getById(transferFromId)
      const transferTo = await transferService.getById(transferToId)
      if (!transferFrom || !transferTo)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Transfer not found')

      const userBalanceFrom = await userService.transferFundsFrom({
        userId,
        amount: transferFrom.amount
      })
      const userBalanceTo = await userService.transferFundsTo({
        userId: transferTo.userId,
        amount: transferTo.amount
      })
      logger.debug(`Transfer from ${transferFrom.id} to ${transferTo.id}`)
      logger.debug(`User ${userBalanceFrom} ${userBalanceTo}`)

      await transferService.completeTransferMany([transferFromId, transferToId])
      await transactionService.completeTransactionMany([
        transactionFromId,
        transactionToId
      ])
    } catch (error) {
      await transferService.cancelTransferMany([transferFromId, transferToId])
      await transactionService.cancelTransactionMany([
        transactionFromId,
        transactionToId
      ])
      throw error
    }
  }
}
