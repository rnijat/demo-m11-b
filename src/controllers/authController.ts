import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { config } from '@/config/config'
import { SignInPayload } from '@/contracts/auth'
import { IBodyRequest, IContextRequest } from '@/contracts/dto/request'
import { IUserRequest } from '@/contracts/dto/user.dto'
import { redis } from '@/dataSources'
import logger from '@/infrastructure/logger'
import { jwtService, userService } from '@/services'

export const authController = {
  signIn: async (
    { body: { gsmNumber, password } }: IBodyRequest<SignInPayload>,
    res: Response
  ) => {
    try {
      const user = await userService.getByGsmNumber(gsmNumber)
      const comparePassword = user?.comparePassword(password)
      if (!user || !comparePassword) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
      }

      const accessToken = jwtService.generateAccessToken({ id: user.id })
      const refreshToken = jwtService.generateRefreshToken({ id: user.id })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
      })

      return res.status(StatusCodes.OK).json({
        data: { accessToken },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      logger.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  signOut: async (
    { context: { user, accessToken } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      await redis.client.set(
        `expiredToken:${accessToken}`,
        `${user.id}`,
        'EX',
        config.redis.token_expiration,
        'NX'
      )

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  refreshToken: async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' })
    }

    const tokens = jwtService.refreshTokens(refreshToken)
    if (!tokens) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    res.status(200).json({ message: 'Access token refreshed', data: tokens })
  }
}
