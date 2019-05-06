import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares'
import { RequestHandler } from 'express'
import { Limiter } from './limiter/limiter'

export class RateLimit extends BaseMiddleware {
  protected limiter: Limiter

  public constructor ({ scope, max, window }: { scope: string, window: number, max: number }) {
    super()
    this.limiter = new Limiter({ scope, max, window })
  }

  public generate (): RequestHandler {
    const limiter = this.limiter

    return async function rateLimitMiddleware (req, res, next): Promise<void> {
      const basePath = req.baseUrl
      const ip = req.ip
      const clientId = req['clientId']
      const userId = req['authenticatedUserId']

      await limiter.performLimit({
        basePath,
        ip,
        clientId,
        userId
      })

      next()
    }
  }
}
