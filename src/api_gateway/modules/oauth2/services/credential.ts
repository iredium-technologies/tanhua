import { Credential, CredentialType } from '../models/credential'
import { BaseService } from '@iredium/butterfly/lib/services'

export class CredentialService extends BaseService {
  public Model: CredentialType = Credential
}
