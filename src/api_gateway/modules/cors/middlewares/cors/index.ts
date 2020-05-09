import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares/base_middleware'
import express = require('express')
import corsMiddleware = require('cors')

export class Cors extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return corsMiddleware({
      origin: [
        /\.iredium.com/,
        /\.iredium-dev.host/,
        /\.localhost/,
      ]
    });
  }
}
