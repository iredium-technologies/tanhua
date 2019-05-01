import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares/base_middleware'
import express = require('express')

export class ClearSessionForm extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return function sessionFormMiddleware (req, res, next): void {
      if (req['session']) {
        req['sessionForm'] = req['session']['form']
        req['sessionError'] = req['session']['error']
        res.once('finish', (): void => {
          if (req['sessionForm']) {
            req['session']['form'] = null
          }
          if (req['sessionError']) {
            req['session']['error'] = null
          }
          req['session'].save()
        })
      }
      next()
    }
  }
}
