import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares/base_middleware'
import express = require('express')

// butterfly's define req.locals is unreachable for proxy request
export class DefineReqLocals extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return function (req, _res, next): void {
      req['locals'] = {}
      next()
    }
  }
}
