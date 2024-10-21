import { specs, swaggerUi } from '@/infrastructure/swagger/swaggerUi'
import { Router } from 'express'

const router = Router()

router.use('/', swaggerUi.serve)
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true
  })
)

export const docs: Router = router
