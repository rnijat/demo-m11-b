import { objectId } from '@/utils/objectIdValidate'
import Joi from 'joi'

export const orderValidator = {
  createOrder: {
    body: Joi.object().keys({
      productId: Joi.custom(objectId).required(),
      quantity: Joi.number().integer().min(1).max(10).required()
    })
  },
  refundOrder: {
    params: Joi.object().keys({
      orderId: Joi.custom(objectId).required()
    })
  },
  getAll: {
    query: Joi.object().keys({
      limit: Joi.number().integer().min(1).max(100).default(10),
      page: Joi.number().integer().min(1).default(1)
    })
  },
  getById: {
    params: Joi.object().keys({
      orderId: Joi.custom(objectId).required()
    })
  }
}
