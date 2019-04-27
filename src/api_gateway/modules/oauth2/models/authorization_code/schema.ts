import { BaseSchema } from '@iredium/butterfly/lib/models'

export var Schema = new BaseSchema({
  client_id: { type: String, required: true },
  user_id: { type: String, required: true },
  code: { unique: true, type: String, required: true },
  scope: { type: String, required: true },
  redirect_uri: { type: String, required: true },
  active: { type: Boolean, default: true },
  expires_at: { type: Date, required: true }
})
