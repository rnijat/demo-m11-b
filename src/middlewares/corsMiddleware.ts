import { config } from '@/config/config'
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'

export const corsMiddleware = cors({
  origin: config.client_url,
  optionsSuccessStatus: StatusCodes.OK,
  credentials: true
})
