import { redis } from '@/dataSources'
import { Queue } from 'bullmq'

export const paymentQueue = new Queue('paymentQueue', {
  connection: redis.client,
  defaultJobOptions: {
    removeOnComplete: false,
    removeOnFail: false,
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    delay: 1000
  }
})
