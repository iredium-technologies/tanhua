import { BaseSchema } from '@iredium/butterfly/lib/models'

export var Schema = new BaseSchema({
  name: { type: String, required: true },
  redirect_uris: { type: String, required: true },
  client_id: { unique: true, type: String, required: true },
  client_secret: { type: String, required: true },
  scope: { type: String, required: true },
  active: { type: Boolean, default: true }
})
