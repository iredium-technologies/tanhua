import { ApiPolicy } from '@iredium/butterfly/lib/policies'

export class CredentialPolicy extends ApiPolicy {
  public issueCredential (): boolean {
    return true
  }
}
