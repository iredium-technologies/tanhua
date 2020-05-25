import { ApiPolicy } from '@iredium/butterfly/lib/policies'

export class ContextPolicy extends ApiPolicy {
  public me (): boolean {
    return !!this.user
  }
}
