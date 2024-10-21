import { paymentLock } from '@/constants'
import logger from '@/infrastructure/logger'
import { acquireLock, releaseLock } from '@/services/lockService'
import { orderService } from '@/services/orderService'
import { paymentService } from '@/services/paymentService'
import { transferService } from '@/services/transferService'
import { Job } from 'bullmq'

export default class PaymentProcessor {
  static async processPayment(job: Job) {
    const lockKey = `${paymentLock}:${job.data.userId}` // Lock key based on userId
    const ttl = 5000 // Time-to-live for the lock in milliseconds (adjust based on job duration)

    const lock = await acquireLock(lockKey, ttl, job.id)
    if (!lock) {
      logger.warn(
        `Lock could not be acquired for processPayment: user ${job.data.userId} - job id ${job.id}`
      )
      return
    }

    try {
      logger.info(`Processing payment for user ${job.data.userId}`)
      await orderService.processOrderFlow(job.data)
      logger.info(
        `Payment processed successfully for user ${job.data.userId} - job id ${job.id}`
      )
    } catch (error) {
      logger.error(
        `Error processing payment for user ${job.data.userId}: ${error}`
      )
      throw error
    } finally {
      await releaseLock(lock, job.id)
    }
  }

  static async topupBalance(job: Job) {
    const lockKey = `${paymentLock}:${job.data.userId}`
    const ttl = 5000

    const lock = await acquireLock(lockKey, ttl, job.id)
    if (!lock) {
      logger.warn(
        `Lock could not be acquired for topupBalance: user ${job.data.userId} - job id ${job.id}`
      )
      return
    }

    try {
      logger.info(`Topping up balance for user ${job.data.userId}`)
      await paymentService.processPaymentFlow(job.data)
      logger.info(
        `Balance topped up successfully for user ${job.data.userId} - job id ${job.id}`
      )
    } finally {
      await releaseLock(lock, job.id)
    }
  }

  static async transfer(job: Job) {
    const lockKey = `${paymentLock}:${job.data.userId}`
    logger.debug(lockKey)
    const ttl = 5000

    const lock = await acquireLock(lockKey, ttl, job.id)
    if (!lock) {
      logger.warn(
        `Lock could not be acquired for transfer: user ${job.data.userId} - job id ${job.id}`
      )
      return
    }

    try {
      logger.info(`Transferring amount for user ${job.data.userId}`)
      await transferService.transferFundsProcess(job.data)
      logger.info(
        `Amount transferred successfully for user ${job.data.userId} - job id ${job.id}`
      )
    } finally {
      await releaseLock(lock, job.id)
    }
  }

  static async refund(job: Job) {
    const lockKey = `${paymentLock}:${job.data.userId}`
    const ttl = 5000

    const lock = await acquireLock(lockKey, ttl, job.id)
    if (!lock) {
      logger.warn(
        `Lock could not be acquired for refund: user ${job.data.userId} - job id ${job.id}`
      )
      return
    }

    try {
      logger.info(`Refunding for user ${job.data.userId}`)
      await orderService.processOrderRefundFlow(job.data)
      logger.info(
        `Refund processed successfully for user ${job.data.userId} - job id ${job.id}`
      )
    } finally {
      await releaseLock(lock, job.id)
    }
  }
}
