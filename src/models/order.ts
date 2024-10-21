import { IOrder, OrderModel } from '@/contracts/model/order'
import { Schema, model } from 'mongoose'
import { mongoosePagination } from 'mongoose-paginate-ts'

const schema = new Schema<IOrder, OrderModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    refundRequested: { type: Boolean, default: false },
    refundProcessed: { type: Boolean, default: false }
  },
  { timestamps: true }
)

// schema.plugin(toJSON)
schema.plugin(mongoosePagination)

export const Order = model<IOrder, OrderModel>('Order', schema)
