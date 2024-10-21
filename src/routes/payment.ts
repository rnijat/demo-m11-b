import { Router } from 'express'

import { paymentValidator } from '@/contracts/validate'
import { paymentController } from '@/controllers/paymentController'
import { authGuard } from '@/guards'
import validate from '@/middlewares/validateMiddleware'

const router = Router()

router.post(
  '/charge',
  authGuard.isAuth,
  validate(paymentValidator.paymentCreate),
  paymentController.paymentCreate
)

export const payment: Router = router
