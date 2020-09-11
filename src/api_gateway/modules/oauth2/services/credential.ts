import { AuthorizationCodeService } from './authorization_code'
import { ApplicationInterface } from './../models/application/interface'
import { Application } from './../models/application'
import { CredentialInterface } from './../models/credential/interface'
import { Credential, CredentialType } from '../models/credential'
import { BaseService } from '@iredium/butterfly/lib/services'
import { UnauthenticatedError } from '@iredium/butterfly/lib/errors'
import crypto = require('crypto')

export class CredentialService extends BaseService {
  public Model: CredentialType
  protected tokenType: string = 'Bearer'
  protected grantType: string = ''
  protected clientId: string = ''
  protected clientSecret: string = ''
  protected scope: string = ''
  protected authenticatedUserId: string = ''
  protected refreshToken: string = ''
  protected tokenExpiresIn: number = 2
  protected code: string = ''
  protected redirectUri: string = ''

  public constructor () {
    super(Credential)
  }

  public async create ({
    grant_type,
    client_id,
    client_secret,
    scope,
    authenticated_user_id = null,
    refresh_token = null,
    code = null,
    redirect_uri = null
  }): Promise<CredentialInterface> {
    const application: ApplicationInterface = await Application.findOne({ client_id })
    if (!application || application.client_secret !== client_secret) {
      throw new UnauthenticatedError('Invalid Client ID or Client Secret')
    }
    this.grantType = grant_type
    this.clientId = client_id
    this.clientSecret = client_secret
    this.scope = scope
    this.authenticatedUserId = authenticated_user_id
    this.refreshToken = refresh_token
    this.code = code
    this.redirectUri = redirect_uri
    return this.issueToken()
  }

  protected async issueToken (): Promise<CredentialInterface> {
    switch (this.grantType) {
      case 'client_credentials': {
        return this.createToken()
      }

      case 'password': {
        return this.createRefreshableToken()
      }

      case 'refresh_token': {
        return this.resfreshToken()
      }

      case 'authorization_code': {
        const authorizationCodes = new AuthorizationCodeService()
        const authorizationCode = await authorizationCodes.Model.findOne({ active: true, code: this.code })
        if (!authorizationCode) throw new UnauthenticatedError('Invalid or expired authorization code')
        authorizationCode.active = false
        await authorizationCode.save()
        this.authenticatedUserId = authorizationCode.user_id
        this.scope = authorizationCode.scope
        if (this.authenticatedUserId) {
          return this.createRefreshableToken()
        } else {
          return this.createToken()
        }
      }

      default: {
        throw new UnauthenticatedError('Invalid grant type')
      }
    }
  }

  protected async createToken (): Promise<CredentialInterface> {
    const token = this.generateToken()
    const expiresAt = this.getDateHoursFromNow(this.tokenExpiresIn)
    // @ts-ignore
    return this.Model.create({
      client_id: this.clientId,
      token_type: this.tokenType,
      token,
      expires_at: expiresAt,
      scope: this.scope
    })
  }

  protected async createRefreshableToken (): Promise<CredentialInterface> {
    if (!this.authenticatedUserId) throw new UnauthenticatedError('authenticated_user_id is required')
    const token = this.generateToken()
    const refreshToken = this.generateRefreshToken()
    const expiresAt = this.getDateHoursFromNow(this.tokenExpiresIn)
    // @ts-ignore
    return this.Model.create({
      user_id: this.authenticatedUserId,
      client_id: this.clientId,
      token_type: this.tokenType,
      token,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      scope: this.scope
    })
  }

  protected async resfreshToken (): Promise<CredentialInterface> {
    if (!this.refreshToken) throw new UnauthenticatedError('Invalid refresh token')
    const oldCredential = await this.Model.findOne({
      active: true,
      refresh_token: this.refreshToken
    })
    if (!oldCredential) {
      throw new UnauthenticatedError('Invalid refresh token')
    }
    oldCredential.active = false
    await oldCredential.save()
    this.scope = oldCredential.scope
    if (oldCredential.user_id) {
      this.authenticatedUserId = oldCredential.user_id
      return this.createRefreshableToken()
    }
    return this.createToken()
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
    return this.getHash(JSON.stringify({
      type: 'refresh_token',
      ...this.tokenData()
    }))
  }

  protected tokenData (): object {
    return {
      generatedAt: Date.now(),
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
