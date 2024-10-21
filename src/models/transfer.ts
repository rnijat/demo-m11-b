import { ITransfer, TransferModel } from '@/contracts/model/transfer'
import { Schema, model } from 'mongoose'
import { mongoosePagination } from 'mongoose-paginate-ts'

const schema = new Schema<ITransfer, TransferModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    otherUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    },
    direction: {
      type: String,
      enum: ['in', 'out']
    }
  },
  { timestamps: true }
)

schema.plugin(mongoosePagination)

export const Transfer = model<ITransfer, TransferModel>('Transfer', schema)
