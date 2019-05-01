import { ApplicationInterface } from './../models/application/interface'
import { Application, ApplicationType } from '../models/application'
import { BaseService } from '@iredium/butterfly/lib/services'
import { Crypto } from '@iredium/butterfly/lib/helpers/crypto'

export class ApplicationService extends BaseService {
  public Model: ApplicationType

  public constructor () {
    super(Application)
  }

  public async create (body): Promise<ApplicationInterface> {
    const clientId = this.generateClientId()
    const clientSecret = this.generateClientSecret()
    return this.Model.create({
      ...body,
      ...{
        client_id: clientId,
        client_secret: clientSecret
      }
    })
  }

  protected generateClientId (): string {
    const id = Crypto.encrypt(JSON.stringify({
      rand: Math.random(),
      time: Date.now()
    }), 'base64')
    return `${id}.apps.iredium.com`
  }

  protected generateClientSecret (): string {
    return Crypto.encrypt(JSON.stringify({
      rand: Math.random(),
      time: Date.now()
    }), 'base64')
  }
}
