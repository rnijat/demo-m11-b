import { PaginateModel } from '@/contracts/mongoose'
import { ObjectId } from 'mongoose'

export interface ITransfer {
  userId: ObjectId
  otherUserId: ObjectId
  amount: number
  status: string
  direction: 'in' | 'out'
}

export type TransferModel = PaginateModel<ITransfer>
