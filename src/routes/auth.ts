import { Router } from 'express'

import { authController } from '@/controllers'
import { authGuard } from '@/guards'
import { authValidation } from '@/validations'

const router = Router()

router.post(
  '/sign-in',
  authGuard.isGuest,
  authValidation.signIn,
  authController.signIn
)
router.get('/sign-out', authGuard.isAuth, authController.signOut)
router.post('/refresh', authController.refreshToken)

export const auth: Router = router
