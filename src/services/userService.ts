import { ClientSession, ObjectId } from 'mongoose'

import { User } from '@/models'

export const userService = {
  create: (
    {
      gsmNumber,
      password,
      firstName,
      lastName,
      birthDate,
      balance
    }: {
      gsmNumber: string
      password: string
      firstName?: string
      lastName?: string
      birthDate: Date
      balance: number
    },
    session?: ClientSession
  ) =>
    new User({
      gsmNumber,
      password,
      firstName,
      lastName,
      birthDate,
      balance
    }).save({ session }),

  getById: (userId: ObjectId) => User.findById(userId),

  getByGsmNumber: (gsmNumber: string) => User.findOne({ gsmNumber }),

  isExistByGsmNumber: (gsmNumber: string) => User.exists({ gsmNumber }),

  updateBalance: (userId: ObjectId, balance: number) =>
    User.findByIdAndUpdate(userId, { balance }, { new: true }),

  hasEnoughBalance: async ({
    userId,
    amount
  }: {
    userId: ObjectId
    amount: number
  }) => await User.findOne({ _id: userId, balance: { $gte: amount } }),

  chargeUserFunds: ({ userId, amount }: { userId: ObjectId; amount: number }) =>
    User.findByIdAndUpdate(
      { _id: userId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { new: true }
    ),

  chargeBackUserFunds: ({
    userId,
    amount
  }: {
    userId: ObjectId
    amount: number
  }) =>
    User.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount } },
      { new: true }
    ),

  getOtherUsers: ({
    userId,
    page,
    limit
  }: {
    userId: ObjectId
    page: number
    limit: number
  }) => {
    const query = { _id: { $ne: userId } }
    return User.paginate({
      page,
      limit,
      query
    })
  },

  transferFundsFrom: ({
    userId,
    amount
  }: {
    userId: ObjectId
    amount: number
  }) =>
    User.findByIdAndUpdate(
      userId,
      { $inc: { balance: -amount } },
      { new: true }
    ),

  transferFundsTo: ({ userId, amount }: { userId: ObjectId; amount: number }) =>
    User.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount } },
      { new: true }
    ),

  topUpBalance: ({ userId, amount }: { userId: ObjectId; amount: number }) =>
    User.findByIdAndUpdate(userId, { $inc: { balance: amount } }, { new: true })
}
