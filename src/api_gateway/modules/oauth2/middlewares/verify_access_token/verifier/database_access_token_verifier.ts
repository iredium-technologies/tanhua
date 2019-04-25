import { CredentialInterface } from './../../../models/credential/interface'
import { UnauthorizedError } from '@iredium/butterfly/lib/errors'
import { CredentialService } from '~/src/api_gateway/modules/oauth2/services/credential'
import { BaseVerifier } from '~/src/api_gateway/modules/oauth2/middlewares/verify_access_token/verifier/base_verifier'

export class DatabaseAccessTokenVerifier extends BaseVerifier {
  protected async checkTokenValidity (): Promise<CredentialInterface> {
    const credentials = new CredentialService()
    const credential = await credentials.find({
      query: {
        token: this.token,
        active: true,
        expires_at: {
          $gte: new Date()
        }
      }
    })
    if (!credential.length) throw new UnauthorizedError(this.invalidTokenErrorMessage)
    return credential[0] as CredentialInterface
  }
}
