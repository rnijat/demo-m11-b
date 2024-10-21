import { NextFunction, Request, Response } from 'express'

import { redis } from '@/dataSources'
import { jwtService, userService } from '@/services'
import { getAccessTokenFromHeaders } from '@/utils/headers'
import logger from '@/infrastructure/logger'

export const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    Object.assign(req, { context: {} })
    logger.debug('check token - > ', req.headers)
    const { accessToken } = getAccessTokenFromHeaders(req.headers)
    logger.debug('access token - > ', accessToken)
    if (!accessToken) return next()

    const { id } = jwtService.verifyAccessToken(accessToken)
    if (!id) return next()

    const isAccessTokenExpired = await redis.client.get(
      `expiredToken:${accessToken}`
    )
    if (isAccessTokenExpired) return next()
    const user = await userService.getById(id)
    if (!user) return next()
    Object.assign(req, {
      context: {
        user,
        accessToken
      }
    })

    return next()
  } catch (error) {
    logger.debug('check token -> ', error)
    return next()
  }
}
