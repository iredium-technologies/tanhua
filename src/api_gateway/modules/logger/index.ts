import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares/base_middleware'
import { Logger } from './middlewares/logger'

export function nuxt ({ hook }): void {
  hook('butterfly:registerMiddlewares', (middlewares: BaseMiddleware[]): void => {
    middlewares.push(new Logger())
  })
}
