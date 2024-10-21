import { PaginateModel } from '@/contracts/mongoose'
import { ObjectId } from 'mongoose'

export interface IOrder {
  userId: ObjectId
  productId: ObjectId
  quantity: number
  totalAmount: number
  status: string
  refundRequested?: boolean
  refundProcessed?: boolean
}

export type OrderModel = PaginateModel<IOrder>
