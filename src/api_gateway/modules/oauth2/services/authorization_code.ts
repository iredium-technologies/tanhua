import { AuthorizationCodeInterface } from './../models/authorization_code/interface'
import { AuthorizationCode, AuthorizationCodeType } from '../models/authorization_code'
import { BaseService } from '@iredium/butterfly/lib/services'
import crypto = require('crypto')

export class AuthorizationCodeService extends BaseService {
  public Model: AuthorizationCodeType
  protected codeExpiresIn: number = 2
  protected clientId: string = ''
  protected clientSecret: string = ''
  protected authenticatedUserId: string = ''
  protected scope: string = ''
  protected redirectUri: string = ''

  public constructor () {
    super(AuthorizationCode)
  }

  public async create ({ client_id, client_secret, authenticated_user_id, scope, redirect_uri }): Promise<AuthorizationCodeInterface> {
    this.clientId = client_id
    this.clientSecret = client_secret
    this.authenticatedUserId = authenticated_user_id
    this.scope = scope
    this.redirectUri = redirect_uri
    const token = this.generateToken()
    const expiresAt = this.getDateHoursFromNow(this.codeExpiresIn)
    // @ts-ignore
    return this.Model.create({
      code: token,
      client_id,
      user_id: authenticated_user_id,
      expires_at: expiresAt,
      scope,
      redirect_uri
    })
  }

  protected getDateHoursFromNow (hours): Date {
    const date = new Date()
    date.setHours(date.getHours() + hours)
    return date
  }

  protected generateToken (): string {
    return this.getHash(JSON.stringify(this.tokenData()))
  }

  protected generateRefreshToken (): string {
    return this.getHash(JSON.stringify(this.tokenData()))
  }

  protected tokenData (): object {
    return {
      date: Date.now(),
      tag: 'authorization_code',
      authenticatedUserId: this.authenticatedUserId,
      clientId: this.clientId
    }
  }

  protected getHash (str: string, algo = 'sha256'): string {
    const hash = crypto.createHmac(algo, this.clientSecret)
    hash.update(str)
    return hash.digest('hex')
  }
}
