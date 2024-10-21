import { config } from '@/config/config'
import logger from '@/infrastructure/logger'
import { connect, connection } from 'mongoose'

export const mongoose = {
  run: async () => {
    try {
      return await connect(config.mongoose.url)
    } catch (error) {
      logger.error(error)
    }
  },

  stop: async () => {
    try {
      return await connection.destroy()
    } catch (error) {
      logger.error(error)
    }
  }
}
