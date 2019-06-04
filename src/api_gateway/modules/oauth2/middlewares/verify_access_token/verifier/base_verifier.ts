import { CredentialInterface } from './../../../models/credential/interface'
import { UnauthenticatedError } from '@iredium/butterfly/lib/errors'

export abstract class BaseVerifier {
  protected authorization: string = null
  protected tokenType: string = null
  protected token: string = null
  protected invalidTokenErrorMessage: string = 'Invalid access token'
  protected invalidTokenTypeErrorMessage: string = 'Invalid token type'

  public constructor (authorization: string) {
    if (authorization && typeof authorization === 'string') {
      this.authorization = authorization
      const splitted = authorization.split(' ')
      if (splitted.length === 2) { // TODO: check token format using regex
        this.tokenType = splitted[0]
        this.token = splitted[1]
      } else {
        throw new UnauthenticatedError(this.invalidTokenErrorMessage)
      }
    }
  }

  public async verifyToken (): Promise<CredentialInterface> {
    this.validateAuthorization()
    this.validateTokenType()
    return this.checkTokenValidity()
  }

  protected validateAuthorization (): void {
    if (!this.authorization) {
      throw new UnauthenticatedError(this.invalidTokenErrorMessage)
    }
  }

  protected validateTokenType (): void {
    if (this.tokenType.toLocaleLowerCase() !== 'bearer') {
      throw new UnauthenticatedError(this.invalidTokenTypeErrorMessage)
    }
  }

  protected abstract async checkTokenValidity (): Promise<CredentialInterface>;
}
