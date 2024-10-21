import { Product } from '@/models'
import { ObjectId } from 'mongoose'

export const productService = {
  getAll: ({ page, limit }: { page: number; limit: number }) =>
    Product.paginate({ page, limit }),
  getById: (productId: ObjectId) => Product.findById(productId)
}
