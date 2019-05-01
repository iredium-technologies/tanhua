import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares/base_middleware'
import { UserService } from '../services/user'
import express = require('express')

export class CurrentUser extends BaseMiddleware {
  public generate ({ databases }): express.RequestHandler {
    return async function currentUserMiddleware (req, res, next): Promise<void> {
      if (req['session']) {
        const authenticatedUserId = req['session']['authenticatedUserId']
        if (authenticatedUserId) {
          const users = new UserService()
          const user = await users.Model.findById(authenticatedUserId)
          req['user'] = user
        }
      }
      next()
    }
  }
}
