import { UserService } from '~/src/api_gateway/modules/accounts/services/user'
import { routes } from '~/src/api_gateway/config/routes'
import { databases } from '~/src/api_gateway/config/databases'
import dotenv = require('dotenv')
import path = require('path')

dotenv.config({
  path: path.resolve(process.cwd(), process.env['NODE_ENV'] === 'test' ? '.env.test' : '.env')
})

export default {
  useViewEngine: true,
  useDefaultLogger: false,
  userServiceClass: UserService,
  routes,
  databases,
  env: {
    NODE_ENV: process.env.NODE_ENV,
    APP_NAME: process.env.APP_NAME,
    PORT: process.env.PORT,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SESSION_COOKIE_DOMAIN: process.env.SESSION_COOKIE_DOMAIN,
    MONGO_HOST: process.env.MONGO_HOST,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_DATABASE: process.env.MONGO_DATABASE,
    MONGO_USERNAME:process.env.MONGO_USERNAME,
    MONGO_PASSWORD:process.env.MONGO_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD,
    JWT_SECRET:process.env.JWT_SECRET,
  }
}
