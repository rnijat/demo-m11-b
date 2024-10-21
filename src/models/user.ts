import { compareSync } from 'bcrypt'
import { Schema, model } from 'mongoose'

import { IUser, IUserMethods, UserModel } from '@/contracts/model/user'
import { mongoosePagination } from 'mongoose-paginate-ts'

const schema = new Schema<IUser, UserModel, IUserMethods>(
  {
    gsmNumber: String,
    password: String,
    firstName: String,
    lastName: String,
    birthDate: Date,
    balance: Number
  },
  { timestamps: true }
)

schema.methods.comparePassword = function (password: string) {
  return compareSync(password, this.password)
}

schema.methods.toJSON = function () {
  const obj = this.toObject()

  delete obj.password

  return obj
}

schema.plugin(mongoosePagination)

export const User = model<IUser, UserModel>('User', schema)
