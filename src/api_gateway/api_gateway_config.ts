import { UserService } from '~/src/api_gateway/modules/accounts/services/user'
import { apis } from '~/src/api_gateway/config/apis'

export default {
  apis,
  userServiceClass: UserService,
  modules: [
    () => import('~/src/api_gateway/modules/cors'),
    () => import('~/src/api_gateway/modules/logger'),
    () => import('~/src/api_gateway/modules/proxy'),
    () => import('~/src/api_gateway/modules/method_override'),
    () => import('~/src/api_gateway/modules/session'),
    () => import('~/src/api_gateway/modules/accounts'),
    () => import('~/src/api_gateway/modules/oauth2'),
    () => import('~/src/api_gateway/modules/rate_limit'),
    () => import('~/src/api_gateway/modules/error_log')
  ]
}
