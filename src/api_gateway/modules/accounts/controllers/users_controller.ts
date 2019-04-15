import { UserService } from '../services/user'
import { ApiController } from '@iredium/butterfly/lib/controllers'
import { UserPolicy } from '../policies/user'
import { BaseResponse } from '@iredium/butterfly/lib/routes/responses/base_response'
import { JsonResponse } from '@iredium/butterfly/lib/routes/responses/json'

export class UsersController extends ApiController {
  public constructor () {
    super(UserService, UserPolicy)
  }

  public async me (req): Promise<BaseResponse> {
    this.authorize('me')
    return new JsonResponse(this.user)
  }
}
