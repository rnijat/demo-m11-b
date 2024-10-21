import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
  ICombinedRequest,
  IContextRequest,
  IQueryRequest
} from '@/contracts/dto/request'
import {
  IAllUserRequest,
  ITransferMoneyRequest,
  IUserRequest
} from '@/contracts/dto/user.dto'
import { IUser } from '@/contracts/model/user'
import { transferService, userService } from '@/services'

export const userController = {
  me: async (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ReasonPhrases.NOT_FOUND,
        status: StatusCodes.NOT_FOUND
      })
    }

    return res.status(StatusCodes.OK).json({
      data: { ...user.toJSON() },
      message: ReasonPhrases.OK,
      status: StatusCodes.OK
    })
  },

  getOtherUsers: async (
    {
      context: { user },
      query: { page, limit }
    }: ICombinedRequest<IUserRequest, IQueryRequest<IAllUserRequest>>,
    res: Response
  ) => {
    const users = await userService.getOtherUsers({
      page: page as unknown as number,
      limit: limit as unknown as number,
      userId: user.id
    })

    return res.status(StatusCodes.OK).json({
      data: users,
      message: ReasonPhrases.OK,
      status: StatusCodes.OK
    })
  },

  transferFunds: async (
    {
      context: { user },
      body: { userId, amount }
    }: ICombinedRequest<IUserRequest, ITransferMoneyRequest>,
    res: Response
  ) => {
    await transferService.transferFunds({
      user: user as IUser,
      otherUserId: userId,
      amount
    })

    return res.status(StatusCodes.OK).json({
      message: ReasonPhrases.OK,
      status: StatusCodes.OK
    })
  }
}
