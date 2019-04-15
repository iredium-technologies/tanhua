import { BaseVerifier } from '~/src/api_gateway/modules/oauth2/middlewares/verify_access_token/verifier/base_verifier'

export class DatabaseAccessTokenVerifier extends BaseVerifier {
  protected async checkTokenValidity (): Promise<void> {

  }
}
