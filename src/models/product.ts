import { IProduct, IProductModel } from '@/contracts/model/product'

import { model, Schema } from 'mongoose'
import { mongoosePagination } from 'mongoose-paginate-ts'

const schema = new Schema<IProduct, IProductModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
  },
  { timestamps: true }
)

schema.plugin(mongoosePagination)

export const Product = model<IProduct, IProductModel>('Product', schema)
