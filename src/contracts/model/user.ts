import { PaginateModel } from '@/contracts/mongoose'
import { ObjectId } from 'mongoose'

export interface IUser extends IUserMethods {
  id: ObjectId
  gsmNumber: string
  password: string
  firstName?: string
  lastName?: string
  birthDate: Date
  balance: number
}

export interface IUserMethods {
  comparePassword: (password: string) => boolean
}

export type UserModel = PaginateModel<IUser>
