import '@/infrastructure/logger'
import logger from '@/infrastructure/logger'
import { Product } from '@/models'
import { faker } from '@faker-js/faker'

export const seedProducts = async (numberOfProducts: number) => {
  try {
    const productCount = await Product.countDocuments()
    if (productCount > 0) {
      await Product.deleteMany({})
      logger.info(
        'Collection is not empty, skipping product seeding. Please delete all documents in the Product collection before seeding.'
      )
    }

    for (let i = 0; i < numberOfProducts; i++) {
      const productData = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 1, max: 30 })),
        image: faker.image.url()
      }

      // eslint-disable-next-line no-await-in-loop
      await Product.create(productData)
      logger.info(`Product ${i + 1} created: ${productData.title}`)
    }

    logger.info(`${numberOfProducts} products have been seeded successfully.`)
  } catch (err) {
    logger.error('Error occurred during product seeding:', err)
  }
}
