import swaggerjsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Demo Proj',
      version: '1.0.0',
      description: 'Demo API'
    }
  },
  apis: ['src/infrastructure/swagger/*.yml', 'src/routes/*.ts']
}

const specs = swaggerjsdoc(options)

export { specs, swaggerUi }
