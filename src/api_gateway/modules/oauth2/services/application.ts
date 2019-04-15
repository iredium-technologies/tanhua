import { Application, ApplicationType } from '../models/application'
import { BaseService } from '@iredium/butterfly/lib/services'

export class ApplicationService extends BaseService {
  public Model: ApplicationType

  public constructor () {
    super(Application)
  }
}
