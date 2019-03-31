import { UserService } from '@iredium/butterfly/lib/services'
import { routes } from '~/src/config/routes'
import { databases } from '~/src/config/databases'

export default {
  userServiceClass: UserService,
  routes,
  databases
}
