import { User, UserType } from '~/src/api_gateway/modules/accounts/models/user'
import { BaseService } from '@iredium/butterfly/lib/services'

export class UserService extends BaseService {
  public Model: UserType = User
}
