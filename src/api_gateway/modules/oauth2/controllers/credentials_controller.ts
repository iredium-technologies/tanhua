import { CredentialService } from '../services/credential'
import { ApiController } from '@iredium/butterfly/lib/controllers'
import { CredentialPolicy } from '../policies/credential'
import { JsonResponse } from '@iredium/butterfly/lib/routes'

export class CredentialsController extends ApiController {
  protected service: CredentialService
  protected policy: CredentialPolicy

  public constructor () {
    super(CredentialService, CredentialPolicy)
  }

  public async index (): Promise<JsonResponse> {
    const credentials = await this.service.find({
      query: {
        active: true,
        expires_at: {
          $gte: new Date()
        }
      }
    })
    return new JsonResponse(credentials)
  }

  public async create (req): Promise<JsonResponse> {
    this.authorize('issueCredential')
    const credential = await this.service.create(req.body)
    const now = new Date()
    const expiresAt = new Date(credential.expires_at)
    const diff = Math.floor((expiresAt.getTime() - now.getTime()) / 1000)
    const refresh_token = credential.refresh_token
    return new JsonResponse({
      token_type: credential.token_type,
      access_token: credential.token,
      refresh_token,
      scope: credential.scope,
      expires_in: diff,
      expires_at: credential.expires_at
    })
  }
}
