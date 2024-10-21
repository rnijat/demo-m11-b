import { PaginateModel } from '@/contracts/mongoose'
import { ObjectId } from 'mongoose'

export interface IProduct {
  id: ObjectId
  title: string
  description: string
  price: number
  image: string
}

export type IProductModel = PaginateModel<IProduct>
