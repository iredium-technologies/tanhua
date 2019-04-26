import { BaseService } from '@iredium/butterfly/lib/services'
import { ApiController } from '@iredium/butterfly/lib/controllers'
import { OauthPolicy } from '../policies/oauth'
import { BaseResponse } from '@iredium/butterfly/lib/routes/responses/base_response'
import { JsonResponse } from '@iredium/butterfly/lib/routes/responses/json'

export class OauthController extends ApiController {
  public constructor () {
    super(BaseService, OauthPolicy)
  }

  public async token (req): Promise<BaseResponse> {
    this.authorize('token')
    return new JsonResponse({ msg: 'hello' })
  }
}
