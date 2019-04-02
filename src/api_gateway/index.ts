import { ApiGatewayConfig } from '~/src/api_gateway/types/api_gateway_config'
import express from 'express'
import { ApiConfig } from '~/src/api_gateway/types/api_config'
import { middlewares } from '~/src/api_gateway/middlewares'
import proxy = require('express-http-proxy')

export class ApiGateway {
  protected app: express.Application
  protected apis: ApiConfig
  protected proxy
  protected middlewares
  protected hooks: object
  protected modules: Array<string>

  public constructor (app: express.Application, config: ApiGatewayConfig) {
    this.app = app
    this.proxy = proxy
    this.apis = config.apis
    this.modules = config.modules || []
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

  public async init (): Promise<void> {
    await this.loadModules()
    this.registerMiddlewares()
  }

  protected async loadModules (): Promise<void> {
    for (let modulePath of this.modules) {
      modulePath = modulePath.replace(`~/${__dirname}`, '.')
      const m = await import(`${modulePath}`)
      m.default({
        hook: (name, handler): void => {
          this.hook(name, handler)
        }
      })
    }
  }

  protected registerMiddlewares (): void {
    for (let api of this.apis) {
      const middlewares = this.middlewares
      const config = api.config

      config['proxyErrorHandler'] = this.errorHandlerFactory()
      middlewares.push(this.proxy(api.host, config))

      this.executeHookHandlers('tanhua:registerApiMiddlewares', { middlewares, api })

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
