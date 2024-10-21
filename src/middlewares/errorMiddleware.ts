import { config } from '@/config/config'
import ApiError from '@/contracts/dto/error'
import logger from '@/infrastructure/logger'
import { NextFunction, Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'

export const errorConverter = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.INTERNAL_SERVER_ERROR
    const message = error.message || ReasonPhrases[statusCode]
    error = new ApiError(statusCode, message, false, err.stack)
  }
  next(error)
}

// Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let { statusCode, message } = err
  if (
    (config.env === 'development' || config.env === 'test') &&
    !err.isOperational
  ) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    message = ReasonPhrases[StatusCodes.INTERNAL_SERVER_ERROR]
  }
  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    ...((config.env === 'development' || config.env === 'test') && {
      stack: err.stack
    })
  }

  if (config.env === 'development' || config.env === 'test') {
    logger.error(err)
  }

  res.status(statusCode).send(response)
}
