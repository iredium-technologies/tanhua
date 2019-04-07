import { BaseSchema } from '@iredium/butterfly/lib/models'

export var Schema = new BaseSchema({
  user_id: { type: String, required: true },
  client_id: { type: String, required: true },
  active: { type: Boolean, default: true },
  token_type: { type: String, required: true },
  token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  scope: { type: String, required: true },
  expires_at: { type: Date, required: true }
})
