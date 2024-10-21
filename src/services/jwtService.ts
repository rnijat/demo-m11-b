import { config } from '@/config/config'
import { IJwtUser } from '@/contracts/jwt'
import jwt from 'jsonwebtoken'

export const jwtService = {
  generateAccessToken(payload: object): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: '1m'
    })
  },

  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: '7d'
    })
  },

  verifyAccessToken(token: string): IJwtUser | null {
    try {
      return jwt.verify(token, config.jwt.secret) as IJwtUser
    } catch (err) {
      return null
    }
  },

  verifyRefreshToken(
    token: string
  ): jwt.JwtPayload | Record<string, unknown> | null {
    try {
      return jwt.verify(token, config.jwt.secret) as Record<string, unknown>
    } catch (err) {
      return null
    }
  },

  refreshTokens(refreshToken: string): { accessToken: string } | null {
    const decoded = this.verifyRefreshToken(refreshToken)
    if (!decoded) return null

    const newAccessToken = this.generateAccessToken({
      id: decoded?.id
    })
    return { accessToken: newAccessToken }
  }
}
