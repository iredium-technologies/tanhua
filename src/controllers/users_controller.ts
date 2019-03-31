import { UserService } from '@iredium/butterfly/lib/services'
import { ApiController } from '@iredium/butterfly/lib/controllers'
import { UserPolicy } from '@iredium/butterfly/lib/policies'

export class UsersController extends ApiController {
  public constructor () {
    super(UserService, UserPolicy)
  }
}
