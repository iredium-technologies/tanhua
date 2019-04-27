import { BaseModelInterface } from '@iredium/butterfly/lib/models'
import mongoose = require('mongoose')

export interface ApplicationInterface extends BaseModelInterface {
  name: string;
  redirect_uris: string;
  client_id: string;
  client_secret: string;
  scope: string;
  active: boolean;
}
