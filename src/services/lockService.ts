import { redis } from '@/dataSources'
import '@/infrastructure/logger'
import logger from '@/infrastructure/logger'
import Redlock, { Lock } from 'redlock'

const redlock = new Redlock([redis.client], {
  driftFactor: 0.01,
  retryCount: 5,
  retryDelay: 200,
  retryJitter: 200
})

export async function acquireLock(
  lockKey: string,
  ttl: number,
  jobId: string
): Promise<Lock | null> {
  try {
    const lock = await redlock.acquire([lockKey], ttl)
    logger.info(`Lock acquired for key ${lockKey} - job id ${jobId}`)
    return lock
  } catch (err) {
    logger.error(
      `Failed to acquire lock for key  - job id ${jobId} - ${lockKey}: ${err}`
    )
    throw err
  }
}

export async function renewLock(
  lock: Lock,
  ttl: number,
  jobId: string
): Promise<boolean> {
  try {
    await lock.extend(ttl)
    logger.info(`Lock renewed for key ${lock.resources} - job id ${jobId}`)
    return true
  } catch (err) {
    logger.error(
      `Failed to renew lock for key  - job id ${jobId} - ${lock.resources}: ${err}`
    )
    throw err
  }
}

export async function releaseLock(lock: Lock, jobId: string): Promise<void> {
  try {
    await lock.release()
    logger.info(`Lock released for key ${lock.resources} - job id ${jobId}`)
  } catch (err) {
    logger.error(
      `Failed to release lock for key  - job id ${jobId} - ${lock.resources}: ${err}`
    )
    throw err
  }
}
