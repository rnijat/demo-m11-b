import { config } from '@/config/config'
import { auth } from '@/routes/auth'
import { docs } from '@/routes/docs'
import { orders } from '@/routes/order'
import { payment } from '@/routes/payment'
import { products } from '@/routes/products'
import { transfers } from '@/routes/transfer'
import { users } from '@/routes/user'
import { Router } from 'express'

const router: Router = Router()

const defaultRoutes = [
  {
    path: '/auth',
    route: auth
  },
  {
    path: '/users',
    route: users
  },
  {
    path: '/payments',
    route: payment
  },
  {
    path: '/products',
    route: products
  },
  {
    path: '/orders',
    route: orders
  },
  {
    path: '/transfers',
    route: transfers
  }
]

const devRoutes = [
  {
    path: '/docs',
    route: docs
  }
]

defaultRoutes.forEach(route => {
  router.use(route.path, route.route)
})

if (config.env === 'development' || config.env === 'test') {
  devRoutes.forEach(route => {
    router.use(route.path, route.route)
  })
}

export { router }
