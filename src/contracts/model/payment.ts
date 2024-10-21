import { PaginateModel } from '@/contracts/mongoose'
import { ObjectId } from 'mongoose'

export interface IPayment {
  userId: ObjectId
  amount: number
  status: string
}

export type PaymentModel = PaginateModel<IPayment>
