import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongoose'

import { config } from '@/config/config'
import { IAccessToken, IJwtUser } from '@/contracts/jwt'

export const jwtSign = (id: ObjectId): IAccessToken => {
  const accessToken = jwt.sign({ id }, config.jwt.secret, {
    expiresIn: process.env.JWT_EXPIRATION
  })

  return { accessToken }
}

export const jwtVerify = ({ accessToken }: { accessToken: string }) => {
  return jwt.verify(accessToken, config.jwt.secret) as IJwtUser
}
