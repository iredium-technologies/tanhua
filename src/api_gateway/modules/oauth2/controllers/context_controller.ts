import { ApiController } from '@iredium/butterfly/lib/controllers'
import { ContextPolicy } from '../policies/context'
import { BaseResponse } from '@iredium/butterfly/lib/routes'
import { JsonResponse } from '@iredium/butterfly/lib/routes/responses/json'
import axios, { AxiosInstance } from 'axios'
import { CredentialService } from '../services/credential'
import { UnauthenticatedError, UnauthorizedError } from '@iredium/butterfly/lib/errors'

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
    const authorization = req.get('authorization')
    const credentials = new CredentialService()
    const splitted = authorization.split(' ')
    let token

    if (splitted.length === 2) { // TODO: check token format using regex
      token = splitted[1]
    } else {
      throw new UnauthenticatedError()
    }

    const credential = await credentials.find({
      query: {
        token,
        active: true,
        expires_at: {
          $gte: new Date()
        }
      }
    })

    if (!credential.length) throw new UnauthenticatedError()
    if (!credential[0]['user_id'] || this.user._id.toString() !== credential[0]['user_id']) throw new UnauthorizedError()

    return new JsonResponse(req['locals']['user'])
  }
}
