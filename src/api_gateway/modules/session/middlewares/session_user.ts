import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares/base_middleware'
import express = require('express')

export class SessionUser extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
      const userIdKey = 'authenticatedUserId'
      req[userIdKey] = req['session'][userIdKey]
      next()
    }
  }
}
