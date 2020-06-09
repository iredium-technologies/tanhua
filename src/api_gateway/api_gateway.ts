import { Class } from '@iredium/butterfly/lib/types/class'
import { BaseMiddleware, RequestId } from '@iredium/butterfly/lib/middlewares'
import Butterfly from '@iredium/butterfly'
import { ApiGatewayConfig } from '~/src/api_gateway/types/api_gateway_config'
import express from 'express'
import { ApiConfig } from '~/src/api_gateway/types/api_config'
import proxy = require('express-http-proxy')
import { accountsUrl } from './helpers/url'

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
    const app = this.butterfly.app
    app.enable('trust proxy')
    app.use((req, res, next): void => {
      const start = process.hrtime()
      req['locals'] = {
        startTime: start,
        timingMark: {}
      }
      res.locals.accountsUrl = accountsUrl
      next()
    })
    await this.loadModules()
    await this.registerMiddlewares()
  }

  protected async loadModules (): Promise<void> {
    for (let moduleImport of this.modules) {
      const modules = await moduleImport['call']()
      const moduleNames = Object.keys(modules)

      for (let moduleName of moduleNames) {
        const module = modules[moduleName]
        if (module && typeof module === 'function') {
          module({
            hook: (name, handler): void => {
              this.hook(name, handler)
            }
          })
        }
      }
    }
  }

  protected async registerMiddlewares (): Promise<void> {
    for (let api of this.apis) {
      const middlewares = []
      const config = api.config

      this.middlewares.push(new RequestId())

      await this.executeHookHandlers('tanhua:registerApiMiddlewares', { middlewares: this.middlewares, api })
      this.registerProxyHandlers(config)

      for (let middleware of this.middlewares) {
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
        return headers
      },
      userResDecorator: async (proxyRes, proxyResData, userReq, userRes): Promise<string> => {
        await this.executeHookHandlers('tanhua:proxy:userResDecorator', proxyRes, proxyResData, userReq, userRes)
        return proxyResData
      },
      proxyReqOptDecorator: async (proxyReqOpts, srcReq): Promise<object> => {
        await this.executeHookHandlers('tanhua:proxy:proxyReqOptDecorator', proxyReqOpts, srcReq)
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
