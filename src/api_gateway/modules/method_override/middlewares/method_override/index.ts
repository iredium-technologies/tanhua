import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares'
import { RequestHandler } from 'express'
import methodOverride = require('method-override')

export class MethodOverride extends BaseMiddleware {
  public generate (): RequestHandler {
    return methodOverride('_method')
  }
}
