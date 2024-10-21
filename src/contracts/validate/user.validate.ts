import { objectId } from '@/utils/objectIdValidate'
import Joi from 'joi'

export const userValidator = {
  otherUsers: {
    query: Joi.object().keys({
      limit: Joi.number().integer().min(1).max(100).default(10),
      page: Joi.number().integer().min(1).default(1)
    })
  },
  transfer: {
    body: Joi.object().keys({
      userId: Joi.custom(objectId).required(),
      amount: Joi.number().min(1).required()
    })
  }
}
