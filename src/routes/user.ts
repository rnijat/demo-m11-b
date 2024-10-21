import { Router } from 'express'

import { userValidator } from '@/contracts/validate'
import { userController } from '@/controllers'
import { authGuard } from '@/guards'
import validate from '@/middlewares/validateMiddleware'

const router = Router()

router.get(
  '/others',
  authGuard.isAuth,
  validate(userValidator.otherUsers),
  userController.getOtherUsers
)
router.get(
  '/me',
  authGuard.isAuth,

  userController.me
)
router.post(
  '/transfer',
  authGuard.isAuth,
  validate(userValidator.transfer),
  userController.transferFunds
)

export const users: Router = router
