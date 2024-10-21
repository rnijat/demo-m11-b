import { config } from '@/config/config'
import '@/infrastructure/logger'
import logger from '@/infrastructure/logger'
import { seedProducts } from '@/seeder/product'
import { seedUsers } from '@/seeder/user'
import mongoose from 'mongoose'

const seedAll = async () => {
  try {
    logger.info('Mongoose connection connecting')
    await mongoose.connect(config.mongoose.url)
    await seedProducts(100)
    await seedUsers(10)
  } catch (error) {
    logger.error(error)
  } finally {
    await mongoose.disconnect()
    logger.info('Mongoose connection disconnected')
  }
}

seedAll()
