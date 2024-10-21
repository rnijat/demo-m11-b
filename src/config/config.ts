import dotenv from 'dotenv'
import Joi from 'joi'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    APP_URL: Joi.string().required().description('Server url'),
    APP_PORT: Joi.number().default(8000),
    MONGODB_URI: Joi.string().required().description('Mongo DB url'),
    REDIS_URI: Joi.string().required().description('Redis url'),
    REDIS_TOKEN_EXPIRATION: Joi.number().default(3600),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(1)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires')
  })
  .unknown()

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export const config = {
  env: envVars.NODE_ENV,
  app_url: envVars.APP_URL,
  app_port: envVars.APP_PORT,
  client_url: envVars.CLIENT_URL,
  redis: {
    uri: envVars.REDIS_URI,
    token_expiration: envVars.REDIS_TOKEN_EXPIRATION
  },
  mongoose: {
    url: envVars.MONGODB_URI,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  }
}
