import { Kafka } from '@iredium/kafka-adapter'
import { UserCreatedEvent } from '../../../events/users/created'
import { BaseListener } from '@iredium/butterfly/lib/listeners'

export class UserCreatedListener extends BaseListener {
  public async handle (event: UserCreatedEvent): Promise<void> {
    this.kafkaSend(event)
  }

  protected kafkaSend (event): void {
    const topic = 'users.user.created'
    const kafka = new Kafka()
    const payload = [{
      messages: JSON.stringify(event),
      topic
    }]
    kafka.send(payload)
  }
}
