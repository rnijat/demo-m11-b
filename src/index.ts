import cookieParser from 'cookie-parser'
import 'dotenv/config'
import express, { Express } from 'express'

import { config } from '@/config/config'
import { mongoose, redis } from '@/dataSources'
import { i18next, i18nextHttpMiddleware } from '@/i18n'
import '@/infrastructure/logger'
import {
  authMiddleware,
  corsMiddleware,
  notFoundMiddleware
} from '@/middlewares'
import { errorConverter, errorMiddleware } from '@/middlewares/errorMiddleware'
import { router } from '@/routes'
// import { createProxyMiddleware } from 'http-proxy-middleware'

mongoose.run()
redis.run()

const app: Express = express()

app.use(cookieParser())

app.use(
  express.json({ limit: '10mb' }),
  express.urlencoded({ limit: '10mb', extended: true }),
  corsMiddleware,
  i18nextHttpMiddleware.handle(i18next),
  authMiddleware,
  router,
  errorConverter,
  errorMiddleware,
  notFoundMiddleware
)

// app.use(
//   '/',
//   createProxyMiddleware({
//     target: config.app_url,
//     changeOrigin: true
//   })
// )

app.listen(config.app_port)
