import Butterfly from '@iredium/butterfly'
import { ApiGatewayConfig } from '~/src/api_gateway/types/api_gateway_config'
import express from 'express'
import { ApiConfig } from '~/src/api_gateway/types/api_config'
import { RequestId } from '@iredium/butterfly/lib/middlewares'
import proxy = require('express-http-proxy')

export class ApiGateway {
  protected app: express.Application
  protected butterfly: Butterfly
  protected apis: ApiConfig
  protected proxy
  protected middlewares = [RequestId.default()]
  protected hooks: object
  protected modules: Array<string>

  public constructor (butterfly: Butterfly, config: ApiGatewayConfig) {
    this.app = butterfly.app
    this.butterfly = butterfly
    this.proxy = proxy
    this.apis = config.apis
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
      const middlewares = this.middlewares
      const config = api.config

      this.executeHookHandlers('tanhua:registerApiMiddlewares', { middlewares, api })
      this.registerProxyHandlers(config)
      middlewares.push(this.proxy(api.host, config))

      for (let uri of api.uris) {
        this.app.use(uri, ...middlewares)
      }
    }
  }

  protected registerProxyHandlers (config): void {
    const handlers = {
      proxyErrorHandler: (err, res, next): void => {
        // TODO: implement error handler
        this.executeHookHandlers('tanhua:proxy:proxyErrorHandler', [err, res])
        next(err)
      },
      userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes): object => {
        // recieves an Object of headers, returns an Object of headers.
        this.executeHookHandlers('tanhua:proxy:userResHeaderDecorator', [headers, userReq, userRes, proxyReq, proxyRes])
        return headers
      },
      userResDecorator: async (proxyRes, proxyResData, userReq, userRes): Promise<string> => {
        await this.executeHookHandlers('tanhua:proxy:userResDecorator', [proxyRes, proxyResData, userReq, userRes])
        return proxyResData
      },
      proxyReqOptDecorator: async (proxyReqOpts, srcReq): Promise<object> => {
        await this.executeHookHandlers('tanhua:proxy:proxyReqOptDecorator', [proxyReqOpts, srcReq])
        proxyReqOpts.headers['x-request-id'] = srcReq['request_id']
        return proxyReqOpts
      },
      proxyReqBodyDecorator: async (bodyContent, srcReq): Promise<string> => {
        await this.executeHookHandlers('tanhua:proxy:proxyReqBodyDecorator', [bodyContent, srcReq])
        return bodyContent
      }
    }

    for (let key in handlers) {
      config[key] = handlers[key]
    }
  }

  protected executeHookHandlers (name, ...args): void {
    const handlers = this.hooks[name]
    for (let handler of handlers) {
      handler.call(this, ...args)
    }
  }
}
