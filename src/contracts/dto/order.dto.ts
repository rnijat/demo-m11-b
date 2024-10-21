import { ObjectId } from 'mongoose'

export interface IOrderRequest {
  productId: ObjectId
  quantity: number
}

export interface IOrderRefundRequest {
  orderId: ObjectId
}

export interface IAllOrderRequest {
  page: number
  limit: number
}
