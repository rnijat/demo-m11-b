import ApiError from '@/contracts/dto/error'
import { IOrderCreate } from '@/contracts/schema/order.schema'
import { JobTypeEnum } from '@/enums/queue'
import logger from '@/infrastructure/logger'
import { Order } from '@/models'
import { paymentQueue } from '@/queue/paymentQueue'
import { productService } from '@/services/productService'
import { transactionService } from '@/services/transactionService'
import { userService } from '@/services/userService'
import { StatusCodes } from 'http-status-codes'
import { ClientSession, ObjectId } from 'mongoose'

export const orderService = {
  create: async (order: IOrderCreate) => {
    return await Order.create({
      ...order
    })
  },
  createOrderFlow: async ({
    userId,
    productId,
    quantity
  }: {
    userId: ObjectId
    productId: ObjectId
    quantity: number
  }) => {
    const product = await productService.getById(productId)
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    const totalAmount = product.price * quantity

    logger.debug(`User ${userId} has balance ${totalAmount}`)
    const user = await userService.hasEnoughBalance({
      userId,
      amount: totalAmount
    })
    logger.debug(`User ${userId} has enough balance: ${user}`)
    if (!user)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient balance')

    const order = await orderService.create({
      userId,
      productId,
      quantity,
      totalAmount,
      status: 'pending'
    })

    const transaction = await transactionService.create({
      refId: order.id,
      refType: 'Order',
      amount: totalAmount,
      userId,
      direction: 'out',
      description: `Order #${order.id} created`,
      status: 'pending',
      operation: 'order',
      jobId: null,
      paymentId: null
    })

    const job = await paymentQueue.add(JobTypeEnum.PROCESS_PAYMENT, {
      userId,
      transactionId: transaction.id,
      productId,
      orderId: order.id
    })

    await transactionService.updateJobId({
      transactionId: transaction.id,
      jobId: job.id
    })

    return { order, transaction }
  },

  processOrderFlow: async ({
    userId,
    transactionId,
    productId,
    orderId
  }: {
    userId: ObjectId
    transactionId: ObjectId
    productId: ObjectId
    orderId: ObjectId
  }) => {
    const product = await productService.getById(productId)
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    try {
      const transaction = await transactionService.getById(transactionId)
      if (!transaction)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found')

      const order = await orderService.getById({ userId, orderId })
      if (!order) throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')

      await userService.chargeUserFunds({
        userId,
        amount: order.totalAmount
      })

      await orderService.completeOrder({ orderId })

      await transactionService.completeTransaction({ transactionId })

      return order
    } catch (error) {
      await orderService.cancelOrder({ orderId })
      await transactionService.cancelTransaction({
        transactionId
      })
      throw error
    }
  },

  createOrderRefundFlow: async ({
    userId,
    orderId
  }: {
    userId: ObjectId
    orderId: ObjectId
  }) => {
    const order = await orderService.getById({ userId, orderId })
    if (!order) throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')

    await orderService.refundRequest(orderId)
    const transaction = await transactionService.create({
      refId: order.id,
      refType: 'Order',
      amount: order.totalAmount,
      userId,
      direction: 'in',
      description: `Order #${order.id} refunded`,
      status: 'pending',
      operation: 'refund',
      jobId: null,
      paymentId: null
    })

    const job = await paymentQueue.add(JobTypeEnum.REFUND, {
      userId,
      transactionId: transaction.id,
      orderId
    })

    await transactionService.updateJobId({
      transactionId: transaction.id,
      jobId: job.id
    })
  },

  processOrderRefundFlow: async ({
    userId,
    transactionId,
    orderId
  }: {
    userId: ObjectId
    transactionId: ObjectId
    orderId: ObjectId
  }) => {
    try {
      const order = await orderService.getById({ userId, orderId })
      if (!order) throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')

      const transaction = await transactionService.getById(transactionId)
      if (!transaction)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found')

      await userService.chargeBackUserFunds({
        userId,
        amount: order.totalAmount
      })

      await transactionService.completeTransaction({ transactionId })
      await orderService.refundProcess(orderId)
    } catch (error) {
      await orderService.cancelOrder({ orderId })
      await transactionService.cancelTransaction({
        transactionId
      })
      throw error
    }
  },

  completeOrder: (
    { orderId }: { orderId: ObjectId },
    session?: ClientSession
  ) => {
    return Order.updateOne(
      { _id: orderId },
      { status: 'completed' },
      { session }
    )
  },
  cancelOrder: ({ orderId }: { orderId: ObjectId }) => {
    return Order.updateOne({ _id: orderId }, { status: 'cancelled' })
  },
  getAll: ({
    page,
    limit,
    userId
  }: {
    page: number
    limit: number
    userId: ObjectId
  }) =>
    Order.paginate({ query: { userId }, page, limit, populate: 'productId' }),
  getById: ({ userId, orderId }: { userId: ObjectId; orderId: ObjectId }) =>
    Order.findOne({ _id: orderId, userId }),

  getRefundableOrder: ({
    userId,
    orderId
  }: {
    userId: ObjectId
    orderId: ObjectId
  }) =>
    Order.findOne({
      _id: orderId,
      userId,
      refundRequested: false,
      refundProcessed: false,
      status: 'completed'
    }),
  refundRequest: (orderId: ObjectId) => {
    return Order.updateOne({ _id: orderId }, { refundRequested: true })
  },
  refundProcess: (orderId: ObjectId) => {
    return Order.updateOne(
      { _id: orderId },
      { refundProcessed: true, status: 'refunded' }
    )
  }
}
