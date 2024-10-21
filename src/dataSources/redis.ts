import { config } from '@/config/config'
import logger from '@/infrastructure/logger'
import Redis, { Redis as RedisClient } from 'ioredis'

class RedisWrapper {
  private static instance: RedisWrapper

  private readonly redisUri: string

  public client: RedisClient

  constructor(redisUri: string) {
    this.redisUri = redisUri

    this.createClient()
  }

  private createClient() {
    try {
      this.client = new Redis(this.redisUri, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false
      })
    } catch (error) {
      logger.error('Error creating Redis client:', error)
    }
  }

  public async run() {
    this.client.on('connect', () => {
      logger.info('Connected to Redis')
    })

    this.client.on('error', error => {
      logger.error('Redis connection error:', error)
    })
  }

  public async stop() {
    try {
      await this.client.quit()
      logger.info('Disconnected from Redis')
    } catch (error) {
      logger.error('Error while disconnecting Redis:', error)
    }
  }

  public static getInstance(): RedisWrapper {
    if (!RedisWrapper.instance) {
      RedisWrapper.instance = new RedisWrapper(config.redis.uri)
    }

    return RedisWrapper.instance
  }
}

export const redis = RedisWrapper.getInstance()
