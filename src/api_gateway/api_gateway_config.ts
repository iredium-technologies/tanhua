import { UserService } from '~/src/api_gateway/modules/accounts/services/user'
import { apis } from '~/src/api_gateway/config/apis'

export default {
  apis,
  userServiceClass: UserService,
  modules: [
    '~/src/api_gateway/modules/cors',
    '~/src/api_gateway/modules/request_id',
    '~/src/api_gateway/modules/method_override',
    '~/src/api_gateway/modules/session',
    '~/src/api_gateway/modules/accounts',
    '~/src/api_gateway/modules/user_id',
    '~/src/api_gateway/modules/oauth2',
    '~/src/api_gateway/modules/rate_limit',
    '~/src/api_gateway/modules/error_log'
  ]
}
