import { Router } from 'express'

import { transferValidator } from '@/contracts/validate'
import { transferController } from '@/controllers/transferController'
import { authGuard } from '@/guards'
import validate from '@/middlewares/validateMiddleware'

const router = Router()

router.get(
  '/',
  validate(transferValidator.getAll),
  authGuard.isAuth,
  transferController.getAll
)

export const transfers: Router = router
