import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares'
import { Api } from './../../types/api_config'
import { RateLimit } from './middlewares/rate_limit'

export default function rateLimit ({ hook }): void {
  hook('tanhua:registerApiMiddlewares', function ({ middlewares, api }: { middlewares: BaseMiddleware[], api: Api }): void {
    for (let limit of api.rateLimit) {
      middlewares.push(new RateLimit({
        scope: limit.scope,
        max: limit.max,
        window: limit.window
      }))
    }
  })
}
