import { BaseModelInterface } from '@iredium/butterfly/lib/models'
import mongoose = require('mongoose')

export interface UserInterface extends BaseModelInterface {
  string: string;
  redirect_uris: string;
  client_id: string;
  client_secret: string;
  active: boolean;
}
