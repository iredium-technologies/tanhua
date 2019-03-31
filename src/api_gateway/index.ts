import express from 'express'
import { ApiConfig } from '~/src/types/api_config'
import { middlewares } from '~/src/api_gateway/middlewares'
import proxy = require('express-http-proxy')

export class ApiGateway {
  protected app: express.Application
  protected apis: ApiConfig
  protected proxy
  protected middlewares

  public constructor (app: express.Application, apis: ApiConfig) {
    this.app = app
    this.proxy = proxy
    this.apis = apis
    this.middlewares = middlewares
  }

  public registerMiddlewares (): void {
    for (let api of this.apis) {
      const middlewares = this.middlewares
      const config = api.config

      config['proxyErrorHandler'] = this.errorHandlerFactory()
      middlewares.push(this.proxy(api.host, config))

      for (let uri of api.uris) {
        this.app.use(uri, ...middlewares)
      }
    }
  }

  protected errorHandlerFactory (): Function {
    return function proxyErrorHandler (err, res, next): void {
      // TODO: implement error handler
      next(err)
    }
  }
}
