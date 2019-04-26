import { UserService } from '../services/user'
import { ApiController } from '@iredium/butterfly/lib/controllers'
import { UserPolicy } from '../policies/user'
import { BaseResponse } from '@iredium/butterfly/lib/routes/responses/base_response'
import { JsonResponse } from '@iredium/butterfly/lib/routes/responses/json'

export class UsersController extends ApiController {
  protected service: UserService

  public constructor () {
    super(UserService, UserPolicy)
  }

  public async me (req): Promise<BaseResponse> {
    this.authorize('me')
    return new JsonResponse(this.user)
  }

  public async authenticate (req): Promise<BaseResponse> {
    this.authorize('authenticate')
    const user = await this.service.authenticate('password', {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    })
    return new JsonResponse(user)
  }
}
