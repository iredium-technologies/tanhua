import { BasePolicy } from '@iredium/butterfly/lib/policies'

export class ApplicationPolicy extends BasePolicy {
  public index (): boolean {
    return true
  }
}
