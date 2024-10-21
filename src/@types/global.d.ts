/* eslint-disable @typescript-eslint/no-explicit-any */
export declare global {
  namespace Express {
    interface Request {
      context: Context
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: number
      APP_URL: string
      CLIENT_URL: string
      MONGODB_URI: string
      REDIS_URI: string
      REDIS_TOKEN_EXPIRATION: number
      JWT_SECRET: string
      JWT_EXPIRATION: string
    }
  }
}
