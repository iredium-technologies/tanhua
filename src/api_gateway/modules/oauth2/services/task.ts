import { Application as Model, ApplicationType } from '../models/application'
import { BaseService } from '@iredium/butterfly/lib/services'

export class ApplicationService extends BaseService {
  public Model: ApplicationType = Model

  public constructor () {
    super(Model)
  }
}
