import { productValidator } from '@/contracts/validate'
import { productController } from '@/controllers'
import validate from '@/middlewares/validateMiddleware'
import { Router } from 'express'

const router = Router()

router.get(
  '/',
  validate(productValidator.getAllProducts),
  productController.getAllProducts
)

export const products: Router = router
