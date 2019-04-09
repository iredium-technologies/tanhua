import { UserService } from '~/src/api_gateway/modules/accounts/services/user'
import { routes } from '~/src/api_gateway/config/routes'
import { databases } from '~/src/api_gateway/config/databases'

export default {
  useViewEngine: true,
  userServiceClass: UserService,
  routes,
  databases
}
