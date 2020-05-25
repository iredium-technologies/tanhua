import { ApiController } from '@iredium/butterfly/lib/controllers'
import { ContextPolicy } from '../policies/context'
import { BaseResponse } from '@iredium/butterfly/lib/routes'
import { JsonResponse } from '@iredium/butterfly/lib/routes/responses/json'
import axios, { AxiosInstance } from 'axios'

export class ContextController extends ApiController {
  protected axios: AxiosInstance

  public constructor () {
    super(null, ContextPolicy)
    this.axios = axios.create({
      timeout: 10000
    })
  }

  public async me (req): Promise<BaseResponse> {
    this.authorize('me')
    return new JsonResponse(req['locals']['user'])
  }
}
