import { CredentialService } from '../services/credential'
import { ApiController } from '@iredium/butterfly/lib/controllers'
import { CredentialPolicy } from '../policies/credential'

export class CredentialsController extends ApiController {
  public constructor () {
    super(CredentialService, CredentialPolicy)
  }
}
