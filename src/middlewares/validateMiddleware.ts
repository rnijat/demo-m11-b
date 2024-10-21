'use strict'
import ApiError from '@/contracts/dto/error'
import { pick } from '@/utils/pick'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi, { Schema } from 'joi'

// Define the validate function
const validate = (schema: {
  params?: Schema
  query?: Schema
  body?: Schema
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ['params', 'query', 'body'])
    const object = pick(req, Object.keys(validSchema))
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object)

    if (error) {
      const errorMessage = error.details
        .map((details: Joi.ValidationErrorItem) => details.message)
        .join(', ')
      return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage))
    }
    Object.assign(req, value)
    return next()
  }
}

export default validate
