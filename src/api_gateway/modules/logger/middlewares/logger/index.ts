import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares/base_middleware'
import { jsonFormat } from './format'
import express = require('express')
import morgan = require('morgan')

export class Logger extends BaseMiddleware {
  public generate ({ databases }): express.RequestHandler {
    return morgan(jsonFormat)
  }
}
