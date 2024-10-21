import { NextFunction, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import validator from 'validator'

import { SignInPayload } from '@/contracts/auth'
import { IBodyRequest } from '@/contracts/dto/request'

export const authValidation = {
  signIn: (
    req: IBodyRequest<SignInPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.gsmNumber || !req.body.password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      const normalizedGsmNumber = validator.trim(req.body.gsmNumber)

      if (
        !normalizedGsmNumber ||
        !validator.isMobilePhone(normalizedGsmNumber, 'az-AZ')
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      Object.assign(req.body, { email: normalizedGsmNumber })

      return next()
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  }
}
