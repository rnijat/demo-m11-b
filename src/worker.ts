import { mongoose, redis } from '@/dataSources'
import { JobTypeEnum } from '@/enums/queue'
import logger from '@/infrastructure/logger'
import PaymentProcessor from '@/services/queue/paymentService'
import { Worker } from 'bullmq'
;(async () => {
  mongoose.run()
  const worker = new Worker(
    'paymentQueue',
    async job => {
      logger.info(`Processing job ${job.id} with data:`, job.data)
      switch (job.name) {
        case JobTypeEnum.PROCESS_PAYMENT:
          await PaymentProcessor.processPayment(job)
          break
        case JobTypeEnum.TOPUP_BALANCE:
          await PaymentProcessor.topupBalance(job)
          break
        case JobTypeEnum.TRANSFER:
          await PaymentProcessor.transfer(job)
          break
        case JobTypeEnum.REFUND:
          await PaymentProcessor.refund(job)
          break
      }
    },
    {
      concurrency: 4,
      connection: redis.client,
      limiter: {
        max: 4,
        duration: 1000
      }
    }
  )

  worker.on('ready', () => {
    logger.info('Worker is ready!')
  })

  worker.on('completed', job => {
    logger.info(`Job ${job.id} completed! Result: ${job.returnvalue}`)
  })

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job.id} failed! Error: ${err.message}`)
  })
})()
