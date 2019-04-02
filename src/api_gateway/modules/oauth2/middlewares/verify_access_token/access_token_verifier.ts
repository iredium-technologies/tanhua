import { UnauthorizedError } from '@iredium/butterfly/lib/errors'

export class AccessTokenVerifier {
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
        throw new UnauthorizedError(this.invalidTokenErrorMessage)
      }
    }
  }

  public validateToken (): void {
    this.validateAuthorization()
    this.validateTokenType()
    this.checkTokenValidity()
  }

  protected validateAuthorization (): void {
    if (!this.authorization) {
      throw new UnauthorizedError(this.invalidTokenErrorMessage)
    }
  }

  protected validateTokenType (): void {
    if (this.tokenType.toLocaleLowerCase() !== 'bearer') {
      throw new UnauthorizedError(this.invalidTokenTypeErrorMessage)
    }
  }

  protected checkTokenValidity (): void {
    // TODO: validate token
  }
}
