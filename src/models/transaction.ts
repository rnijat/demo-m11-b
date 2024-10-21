import { ITransaction, TransactionModel } from '@/contracts/model/transaction'
import { Schema, model } from 'mongoose'

const schema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    refType: {
      type: String,
      required: true,
      enum: ['Order', 'Transfer', 'Payment']
    },
    refId: { type: String, required: true },
    amount: { type: Number, required: true },
    direction: { type: String, enum: ['in', 'out'], required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      required: true,
      default: 'pending'
    },
    operation: { type: String, required: true },
    jobId: { type: String },
    paymentId: { type: String }
  },
  { timestamps: true }
)

export const Transaction = model<ITransaction, TransactionModel>(
  'Transaction',
  schema
)
