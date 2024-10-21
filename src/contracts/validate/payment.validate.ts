import Joi from 'joi'

export const paymentValidator = {
  paymentCreate: {
    body: Joi.object().keys({
      amount: Joi.number().min(1).max(100).required()
    })
  }
}
