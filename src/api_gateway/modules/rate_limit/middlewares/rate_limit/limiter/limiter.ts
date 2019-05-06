import { BaseError } from '@iredium/butterfly/lib/errors'
import { RequestInfo } from './request_info'

export class Limiter {
  protected scope: string
  protected max: number
  protected window: number
  protected requestInfo: RequestInfo

  public constructor ({ scope, max, window }) {
    this.scope = scope
    this.max = max
    this.window = window
  }

  public async performLimit ({
    basePath,
    ip,
    clientId,
    userId
  }: {
  basePath: string,
  ip: string,
  clientId: string,
  userId: string
  }): Promise<void> {
    const scope = this.scope
    const max = this.max
    const window = this.window
    const requestInfoQuery = {
      basePath,
      scope,
      expiresInSeconds: window,
      ip,
      clientId,
      userId
    }

    if (
      (!ip || !clientId) ||
      (scope === 'user' && !userId)) {
      return
    }

    const requestInfo = await RequestInfo.get(requestInfoQuery)

    if (requestInfo.count >= max) {
      throw new BaseError('Rate Limit', 'Rate limit exceeded', null, {
        basePath,
        scope,
        scopeRef: requestInfo.scopeRef,
        requestCount: requestInfo.count,
        max,
        window: `${window} s`
      })
    } else if (!(userId && scope === 'app')) {
      requestInfo.increment()
    }
  }
}
