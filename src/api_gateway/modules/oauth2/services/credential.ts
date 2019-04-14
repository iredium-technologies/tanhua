import { ApplicationInterface } from './../models/application/interface'
import { Application } from './../models/application'
import { CredentialInterface } from './../models/credential/interface'
import { Credential, CredentialType } from '../models/credential'
import { BaseService } from '@iredium/butterfly/lib/services'
import { UnauthorizedError } from '@iredium/butterfly/lib/errors'

export class CredentialService extends BaseService {
  public Model: CredentialType

  public constructor () {
    super(Credential)
  }

  public async create ({
    client_id,
    client_secret,
    scope,
    user_id = null
  }): Promise<CredentialInterface> {
    const application: ApplicationInterface = await Application.findOne({ client_id })
    if (!application || application.client_secret !== client_secret) {
      throw new UnauthorizedError('Invalid Client ID or Client Secret')
    }
    let credential = await this.Model.findOne({
      client_id,
      active: true,
      expires_at: {
        $gte: new Date()
      }
    })
    if (!credential) {
      credential = await this.createToken({ user_id, client_id, scope })
    }
    return credential
  }

  protected async createToken ({ user_id = null, client_id, scope }): Promise<CredentialInterface> {
    const token_type = 'Bearer'
    const token = this.generateToken()
    const refreshToken = this.generateRefreshToken()
    const expiresAt = this.getDateHoursFromNow(2)
    return this.Model.create({
      user_id,
      client_id,
      token_type,
      token,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      scope
    })
  }

  protected getDateHoursFromNow (hours): Date {
    const date = new Date()
    date.setHours(date.getHours() + hours)
    return date
  }

  protected generateToken (): string {
    return `token-${Date.now()}`
  }

  protected generateRefreshToken (): string {
    return `refresh-token-${Date.now()}`
  }
}
