import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
  IAllOrderRequest,
  IOrderRefundRequest,
  IOrderRequest
} from '@/contracts/dto/order.dto'
import { ICombinedRequest, IQueryRequest } from '@/contracts/dto/request'
import { IUserRequest } from '@/contracts/dto/user.dto'
import { orderService } from '@/services/orderService'
import { ObjectId } from 'mongoose'

export const orderController = {
  getById: async (
    {
      context: { user },
      params: { orderId }
    }: ICombinedRequest<IUserRequest, { orderId: ObjectId }>,
    res: Response
  ) => {
    const order = await orderService.getById({
      userId: user.id,
      orderId: orderId as unknown as ObjectId
    })

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ReasonPhrases.NOT_FOUND,
        status: StatusCodes.NOT_FOUND
      })
    }

    return res.status(StatusCodes.OK).json({
      data: order,
      message: ReasonPhrases.OK,
      status: StatusCodes.OK
    })
  },

  getAll: async (
    {
      context: { user },
      query: { page, limit }
    }: ICombinedRequest<IUserRequest, IQueryRequest<IAllOrderRequest>>,
    res: Response
  ) => {
    const orders = await orderService.getAll({
      page: page as unknown as number,
      limit: limit as unknown as number,
      userId: user.id
    })

    return res.status(StatusCodes.OK).json({
      data: orders,
      message: ReasonPhrases.OK,
      status: StatusCodes.OK
    })
  },
  orderCreate: async (
    {
      context: { user },
      body: { productId, quantity }
    }: ICombinedRequest<IUserRequest, IOrderRequest>,
    res: Response
  ) => {
    const { order } = await orderService.createOrderFlow({
      userId: user.id,
      productId,
      quantity
    })

    return res.status(StatusCodes.CREATED).json({
      data: order,
      message: ReasonPhrases.CREATED,
      status: StatusCodes.CREATED
    })
  },

  orderRefund: async (
    {
      context: { user },
      params: { orderId }
    }: ICombinedRequest<IUserRequest, IOrderRefundRequest>,
    res: Response
  ) => {
    const order = await orderService.getRefundableOrder({
      userId: user.id,
      orderId: orderId as unknown as ObjectId
    })

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Order not found',
        status: StatusCodes.NOT_FOUND
      })
    }
    await orderService.createOrderRefundFlow({
      userId: user.id,
      orderId: orderId as unknown as ObjectId
    })

    return res.status(StatusCodes.OK).json({
      message: 'Order refund requested',
      status: StatusCodes.OK
    })
  }
}
