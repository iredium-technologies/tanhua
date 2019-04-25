import { BaseSchema } from '@iredium/butterfly/lib/models'

export var Schema = new BaseSchema({
  user_id: { type: String, default: null },
  client_id: { type: String, required: true },
  active: { type: Boolean, default: true },
  token_type: { type: String, required: true },
  token: { type: String, required: true },
  refresh_token: { type: String },
  scope: { type: String, required: true },
  expires_at: { type: Date, required: true }
})
