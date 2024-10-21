import Joi from 'joi'

export const transferValidator = {
  getAll: {
    query: Joi.object().keys({
      limit: Joi.number().integer().min(1).max(100).default(10),
      page: Joi.number().integer().min(1).default(1)
    })
  }
}
