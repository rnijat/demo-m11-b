import { IUser } from '@/contracts/model/user'
import { Document, ObjectId } from 'mongoose'

export interface IUserRequest {
  user: Omit<IUser, 'id'> & Document
  accessToken: string
}

export interface ITransferMoneyRequest {
  userId: ObjectId
  amount: number
}

export interface IAllUserRequest {
  page: number
  limit: number
}
