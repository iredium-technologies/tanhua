import { Class } from '@iredium/butterfly/lib/types/class'
import { BaseMiddleware, RequestId } from '@iredium/butterfly/lib/middlewares'
import Butterfly from '@iredium/butterfly'
import { ApiGatewayConfig } from '~/src/api_gateway/types/api_gateway_config'
import express from 'express'
import { ApiConfig } from '~/src/api_gateway/types/api_config'
import proxy = require('express-http-proxy')

export class ApiGateway {
  protected app: express.Application
  protected butterfly: Butterfly
  protected apis: ApiConfig
  protected proxy
  protected middlewares: BaseMiddleware[] = []
  protected hooks: object
  protected modules: Array<string>
  protected userServiceClass: Class;

  public constructor (butterfly: Butterfly, config: ApiGatewayConfig) {
    this.app = butterfly.app
    this.butterfly = butterfly
    this.proxy = proxy
    this.apis = config.apis
    this.userServiceClass = config.userServiceClass
    this.modules = config.modules || []
    this.hooks = {
      'tanhua:registerApiMiddlewares': [],
      'tanhua:proxy:proxyErrorHandler': [],
      'tanhua:proxy:userResHeaderDecorator': [],
      'tanhua:proxy:userResDecorator': [],
      'tanhua:proxy:proxyReqOptDecorator': [],
      'tanhua:proxy:proxyReqBodyDecorator': []
    }
  }

  public hook (name: string, handler: Function): void {
    if (this.hooks[name]) {
      this.hooks[name].push(handler)
    }
    this.butterfly.hook(name, handler)
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
      const middlewares = []
      const config = api.config

      this.middlewares.push(new RequestId())

      this.executeHookHandlers('tanhua:registerApiMiddlewares', { middlewares: this.middlewares })
      this.registerProxyHandlers(config)

      for (let middleware of this.middlewares) {
        middleware.setUserServiceClass(this.userServiceClass)
        middlewares.push(middleware.handleMiddelware())
      }

      middlewares.push(this.proxy(api.host, config))

      for (let uri of api.uris) {
        this.app.use(uri, ...middlewares)
      }
    }
  }

  protected registerProxyHandlers (config): void {
    const handlers = {
      proxyErrorHandler: async (err, res, next): Promise<void> => {
        // TODO: implement error handler
        await this.executeHookHandlers('tanhua:proxy:proxyErrorHandler', err, res)
        next(err)
      },
      userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes): object => {
        // recieves an Object of headers, returns an Object of headers.
        this.executeHookHandlersSynchronous('tanhua:proxy:userResHeaderDecorator', headers, userReq, userRes, proxyReq, proxyRes)
        headers['x-request-id'] = userReq['request_id']
        return headers
      },
      userResDecorator: async (proxyRes, proxyResData, userReq, userRes): Promise<string> => {
        await this.executeHookHandlers('tanhua:proxy:userResDecorator', proxyRes, proxyResData, userReq, userRes)
        return proxyResData
      },
      proxyReqOptDecorator: async (proxyReqOpts, srcReq): Promise<object> => {
        await this.executeHookHandlers('tanhua:proxy:proxyReqOptDecorator', proxyReqOpts, srcReq)
        proxyReqOpts.headers['x-request-id'] = srcReq['request_id']
        return proxyReqOpts
      },
      proxyReqBodyDecorator: async (bodyContent, srcReq): Promise<string> => {
        await this.executeHookHandlers('tanhua:proxy:proxyReqBodyDecorator', bodyContent, srcReq)
        return bodyContent
      }
    }

    for (let key in handlers) {
      config[key] = handlers[key]
    }
  }

  protected executeHookHandlersSynchronous (name, ...args): void {
    const handlers = this.hooks[name]
    for (let handler of handlers) {
      handler.call(this, ...args)
    }
  }

  protected async executeHookHandlers (name, ...args): Promise<void> {
    const handlers = this.hooks[name]
    for (let handler of handlers) {
      await handler.call(this, ...args)
    }
  }
}
