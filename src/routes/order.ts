import { Router } from 'express'

import { orderValidator } from '@/contracts/validate/order.validate'
import { orderController } from '@/controllers/orderController'
import { authGuard } from '@/guards'
import validate from '@/middlewares/validateMiddleware'

const router = Router()

router.get(
  '/',
  validate(orderValidator.getAll),
  authGuard.isAuth,
  orderController.getAll
)
router.get(
  '/:orderId',
  validate(orderValidator.getById),
  authGuard.isAuth,
  orderController.getById
)
router.post(
  '/create',
  validate(orderValidator.createOrder),
  authGuard.isAuth,
  orderController.orderCreate
)
router.post(
  '/:orderId/refund',
  validate(orderValidator.refundOrder),
  authGuard.isAuth,
  orderController.orderRefund
)

export const orders: Router = router
