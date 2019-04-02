import { UserService } from '@iredium/butterfly/lib/services'
import { routes } from '~/src/api_gateway/config/routes'
import { databases } from '~/src/api_gateway/config/databases'

export default {
  userServiceClass: UserService,
  routes,
  databases
}
