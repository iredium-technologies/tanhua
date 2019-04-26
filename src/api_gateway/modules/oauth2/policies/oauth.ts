import { BasePolicy } from '@iredium/butterfly/lib/policies'

export class OauthPolicy extends BasePolicy {
  public index (): boolean {
    return true
  }
}
