import { ApplicationInterface } from './../models/application/interface'
import { Application } from './../models/application'
import { CredentialInterface } from './../models/credential/interface'
import { Credential, CredentialType } from '../models/credential'
import { BaseService } from '@iredium/butterfly/lib/services'
import { UnauthorizedError, BaseError } from '@iredium/butterfly/lib/errors'
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

  public constructor () {
    super(Credential)
  }

  public async create ({
    grant_type,
    client_id,
    client_secret,
    scope,
    authenticated_user_id = null,
    refresh_token = null
  }): Promise<CredentialInterface> {
    const application: ApplicationInterface = await Application.findOne({ client_id })
    if (!application || application.client_secret !== client_secret) {
      throw new UnauthorizedError('Invalid Client ID or Client Secret')
    }
    this.grantType = grant_type
    this.clientId = client_id
    this.clientSecret = client_secret
    this.scope = scope
    this.authenticatedUserId = authenticated_user_id
    this.refreshToken = refresh_token
    let credential = await this.Model.findOne({
      client_id: this.clientId,
      active: true,
      expires_at: {
        $gte: new Date()
      }
    })
    if (!credential) {
      credential = await this.issueToken()
    }
    return credential
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
        if (this.authenticatedUserId) {
          return this.createRefreshableToken()
        } else {
          return this.createToken()
        }
      }

      default: {
        throw new BaseError('Invalid Grant Type', 'invalid grant type')
      }
    }
  }

  protected async createToken (): Promise<CredentialInterface> {
    const token = this.generateToken()
    const expiresAt = this.getDateHoursFromNow(this.tokenExpiresIn)
    return this.Model.create({
      client_id: this.clientId,
      token_type: this.tokenType,
      token,
      expires_at: expiresAt,
      scope: this.scope
    })
  }

  protected async createRefreshableToken (): Promise<CredentialInterface> {
    const token = this.generateToken()
    const refreshToken = this.generateRefreshToken()
    const expiresAt = this.getDateHoursFromNow(this.tokenExpiresIn)
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
    const oldCredential = await this.Model.findOne({
      refresh_token: this.refreshToken
    })
    if (!oldCredential) {
      throw new BaseError('Invalid refresh token')
    }
    if (oldCredential.user_id) {
      return this.createToken()
    }
    return this.createRefreshableToken()
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
