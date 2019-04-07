import { UserType } from '../models/user'
import { BaseService } from '@iredium/butterfly/lib/services'
import mongoose = require('mongoose')

export class UserService extends BaseService {
  public Model: UserType

  public constructor () {
    super(mongoose.model('User'))
  }
}
