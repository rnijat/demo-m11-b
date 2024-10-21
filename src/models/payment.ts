import { IPayment, PaymentModel } from '@/contracts/model/payment'
import { Schema, model } from 'mongoose'
import { mongoosePagination } from 'mongoose-paginate-ts'

const schema = new Schema<IPayment, PaymentModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
)

schema.plugin(mongoosePagination)

export const Payment = model<IPayment, PaymentModel>('Payment', schema)
