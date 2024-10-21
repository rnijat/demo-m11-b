import '@/infrastructure/logger'
import logger from '@/infrastructure/logger'
import { Transaction, User } from '@/models'
import { userService } from '@/services/userService'
import { createHash } from '@/utils/hash'
import { faker } from '@faker-js/faker'

function generateAzerbaijaniPhoneNumber(): string {
  // Valid prefixes for Azerbaijani mobile numbers
  const prefixes = ['10', '50', '51', '55', '70', '77', '99']

  // Randomly select one of the valid prefixes
  const randomPrefix = faker.helpers.arrayElement(prefixes)

  // Generate the remaining 7 digits of the phone number
  const remainingDigits = faker.number.int({ min: 1000000, max: 9999999 })

  // Concatenate to form the final phone number
  return `+994${randomPrefix}${remainingDigits}`
}

export const seedUsers = async (numberOfUsers: number) => {
  try {
    const userCount = await User.countDocuments()
    if (userCount > 0) {
      await User.deleteMany({})
      await Transaction.deleteMany({})
      logger.info(
        'Collection is not empty, skipping user seeding. Please delete all documents in User collection before seeding.'
      )
    }

    const testUserData = {
      gsmNumber: '+994555555555',
      password: await createHash('password123'),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
      balance: 100
    }
    await userService.create(testUserData)
    logger.info(`Test user created with GSM: ${testUserData.gsmNumber}`)

    for (let i = 0; i < numberOfUsers; i++) {
      const userData = {
        gsmNumber: generateAzerbaijaniPhoneNumber(),
        // eslint-disable-next-line no-await-in-loop
        password: await createHash('password123'),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        birthDate: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
        balance: 100
      }

      // eslint-disable-next-line no-await-in-loop
      await userService.create(userData)

      logger.info(`User ${i + 1} created: ${userData.gsmNumber}`)
    }

    logger.info(
      `${numberOfUsers} users and their initial transactions have been seeded successfully.`
    )
  } catch (err) {
    logger.error('Error occurred during seeding:', err)
  }
}
