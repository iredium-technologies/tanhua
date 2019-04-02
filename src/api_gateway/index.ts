import express from 'express'
import { ApiConfig } from '~/src/types/api_config'
import { middlewares } from '~/src/api_gateway/middlewares'
import proxy = require('express-http-proxy')

export class ApiGateway {
  protected app: express.Application
  protected apis: ApiConfig
  protected proxy
  protected middlewares
  protected hooks: object

  public constructor (app: express.Application, apis: ApiConfig) {
    this.app = app
    this.proxy = proxy
    this.apis = apis
    this.middlewares = middlewares
    this.hooks = {
      'tanhua:registerApiMiddlewares': [],
      'tanhua:onProxyError': []
    }
  }

  public hook (name: string, handler: Function): void {
    if (this.hooks[name]) {
      this.hooks[name].push(handler)
    }
  }

  public registerMiddlewares (): void {
    for (let api of this.apis) {
      const middlewares = this.middlewares
      const config = api.config

      config['proxyErrorHandler'] = this.errorHandlerFactory()
      this.executeHookHandlers('tanhua:registerApiMiddlewares', this.app, api)
      middlewares.push(this.proxy(api.host, config))

      for (let uri of api.uris) {
        this.app.use(uri, ...middlewares)
      }
    }
  }

  protected errorHandlerFactory (): Function {
    return function proxyErrorHandler (err, res, next): void {
      // TODO: implement error handler
      this.executeHookHandlers('tanhua:onProxyError', err, res)
      next(err)
    }
  }

  protected executeHookHandlers (name, ...args): void {
    const handlers = this.hooks[name]
    for (let handler of handlers) {
      handler.call(this, ...args)
    }
  }
}
