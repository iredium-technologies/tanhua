import { UserCreatedEvent } from '../../../events/users/created'
import { BaseListener } from '@iredium/butterfly/lib/listeners'

export class UserCreatedListener extends BaseListener {
  public handle (event: UserCreatedEvent): void {
    console.log({listened_event: event})
  }
}
