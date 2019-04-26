import { ApiPolicy } from '@iredium/butterfly/lib/policies'

export class OauthPolicy extends ApiPolicy {
  public token (): boolean {
    return true
  }
}
