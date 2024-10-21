import Joi from 'joi'

export const productValidator = {
  getAllProducts: {
    query: Joi.object().keys({
      limit: Joi.number().integer().min(1).max(100).default(9),
      page: Joi.number().integer().min(1).default(1)
    })
  }
}
