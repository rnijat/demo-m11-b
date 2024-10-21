import { NextFunction, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { IContextRequest } from '@/contracts/dto/request'
import { IUserRequest } from '@/contracts/dto/user.dto'

export const authGuard = {
  isAuth: (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response,
    next: NextFunction
  ) => {
    if (user) {
      return next()
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: ReasonPhrases.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED
    })
  },

  isGuest: (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response,
    next: NextFunction
  ) => {
    if (!user) {
      return next()
    }

    return res.status(StatusCodes.FORBIDDEN).json({
      message: ReasonPhrases.FORBIDDEN,
      status: StatusCodes.FORBIDDEN
    })
  }
}
