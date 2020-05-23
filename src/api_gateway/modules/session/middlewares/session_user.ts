import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares/base_middleware'
import express = require('express')
import { UserService } from '../../accounts/services/user'

export class SessionUser extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return async (req, _res, next): Promise<void> => {
      const userIdKey = 'authenticatedUserId'
      const userId = req['session'][userIdKey]

      if (userId) {
        const service = new UserService()
        const user = await service.get(userId)
        req[userIdKey] = userId
        req['locals']['user'] = user
      }

      next()
    }
  }
}
