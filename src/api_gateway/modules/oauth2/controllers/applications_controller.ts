import { ApplicationService } from '../services/application'
import { ApiController } from '@iredium/butterfly/lib/controllers'
import { ApplicationPolicy } from '../policies/application'

export class ApplicationsController extends ApiController {
  public constructor () {
    super(ApplicationService, ApplicationPolicy)
  }
}
