import { BaseError } from '@iredium/butterfly/lib/errors'
import { User, UserType } from '../models/user'
import { BaseService } from '@iredium/butterfly/lib/services'
import { UserInterface } from '../models/user/interface'

export class UserService extends BaseService {
  public Model: UserType

  public constructor () {
    super(User)
  }

  public async authenticate (strategy, data): Promise<UserInterface> {
    let user: UserInterface = null
    let passwordMatch = false
    const errorName = 'Login Error'
    const errorMessage = 'Invalid username or password'
    if (strategy === 'password') {
      const query = {}
      if (data.username) query['username'] = data.username
      else query['email'] = data.email
      user = await this.Model.findOne(query)
      if (!user) throw new BaseError(errorName, errorMessage)
      passwordMatch = await user.comparePassword(data.password)
      if (!passwordMatch) throw new BaseError(errorName, errorMessage)
    }
    return user
  }
}
