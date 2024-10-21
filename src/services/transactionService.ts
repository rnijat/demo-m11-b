import { Transaction } from '@/models'
import { ObjectId } from 'mongoose'

export const transactionService = {
  create: async ({
    refId,
    refType,
    amount,
    description,
    status,
    operation,
    userId,
    jobId,
    direction,
    paymentId
  }: {
    refId: ObjectId
    refType: 'Order' | 'Transfer' | 'Payment'
    amount: number
    description: string
    status: 'pending' | 'completed' | 'cancelled'
    operation: string
    userId: ObjectId
    jobId?: string
    direction: 'in' | 'out'
    paymentId?: string
  }) =>
    await Transaction.create({
      refId,
      refType,
      amount,
      description,
      status,
      operation,
      userId,
      jobId,
      direction,
      paymentId
    }),

  createMany: async ({
    transactions
  }: {
    transactions: Record<string, unknown>[]
  }) => await Transaction.insertMany(transactions),

  update: async ({
    transactionId,
    status
  }: {
    transactionId: ObjectId
    status: string
  }) => await Transaction.updateOne({ _id: transactionId }, { status }),

  getById: (transactionId: ObjectId) => Transaction.findById(transactionId),

  updateJobId: async ({
    transactionId,
    jobId
  }: {
    transactionId: ObjectId
    jobId: string
  }) => await Transaction.updateOne({ _id: transactionId }, { jobId }),

  updateManyJobId: async ({
    transactionIds,
    jobId
  }: {
    transactionIds: ObjectId[]
    jobId: string
  }) =>
    await Transaction.updateMany({ _id: { $in: transactionIds } }, { jobId }),

  completeTransaction: async ({
    transactionId
  }: {
    transactionId: ObjectId
  }) => {
    await Transaction.updateOne({ _id: transactionId }, { status: 'completed' })
  },

  completeTransactionMany: async (transactionIds: ObjectId[]) => {
    await Transaction.updateMany(
      { _id: { $in: transactionIds } },
      { status: 'completed' }
    )
  },

  cancelTransactionMany: async (transactionIds: ObjectId[]) => {
    await Transaction.updateMany(
      { _id: { $in: transactionIds } },
      { status: 'cancelled' }
    )
  },

  cancelTransaction: async ({ transactionId }: { transactionId: ObjectId }) =>
    await Transaction.updateOne({ _id: transactionId }, { status: 'cancelled' })
}
