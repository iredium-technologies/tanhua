import { UnauthorizedError } from '@iredium/butterfly/lib/errors'
import { CredentialService } from '~/src/api_gateway/modules/oauth2/services/credential'
import { BaseVerifier } from '~/src/api_gateway/modules/oauth2/middlewares/verify_access_token/verifier/base_verifier'

export class DatabaseAccessTokenVerifier extends BaseVerifier {
  protected async checkTokenValidity (): Promise<void> {
    const credentials = new CredentialService()
    const token = await credentials.find({
      query: {
        token: this.token,
        active: true,
        expires_at: {
          $gte: new Date()
        }
      }
    })
    if (!token.length) throw new UnauthorizedError(this.invalidTokenErrorMessage)
  }
}
