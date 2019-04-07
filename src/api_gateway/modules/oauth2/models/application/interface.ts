import { BaseModelInterface } from '@iredium/butterfly/lib/models'
import mongoose = require('mongoose')

export interface UserInterface extends BaseModelInterface {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  complete: boolean;
}
