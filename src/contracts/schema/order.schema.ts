import { ObjectId } from 'mongoose'

export interface IOrderCreate {
  userId: ObjectId
  productId: ObjectId
  quantity: number
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  totalAmount: number
}
