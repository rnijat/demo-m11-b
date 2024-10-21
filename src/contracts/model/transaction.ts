import { Model, ObjectId } from 'mongoose'

export interface ITransaction {
  userId: ObjectId
  refId: ObjectId
  refType: string
  amount: number
  direction: 'in' | 'out'
  description: string
  status: string
  operation: string
  jobId?: string
  paymentId?: string
}

export type TransactionModel = Model<ITransaction>
