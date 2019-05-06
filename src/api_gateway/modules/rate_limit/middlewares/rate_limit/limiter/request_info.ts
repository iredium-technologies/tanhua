import { Redis } from '@iredium/butterfly/lib/databases/redis'

export class RequestInfo {
  public scope: string
  public basePath: string
  public ip: string
  public clientId: string
  public userId: string
  public scopeRef: string
  public count: number
  public expiresInSeconds: number
  protected redis: Redis

  public constructor ({
    scope,
    basePath,
    ip,
    clientId,
    userId,
    count = 0,
    expiresInSeconds = 0
  }: {
  scope: string,
  basePath: string,
  ip: string,
  clientId: string,
  userId: string,
  count: number,
  expiresInSeconds: number
  }) {
    const map = {
      ip,
      app: clientId,
      user: userId
    }
    this.scope = scope
    this.basePath = basePath
    this.ip = ip
    this.clientId = clientId
    this.userId = userId
    this.count = count
    this.expiresInSeconds = expiresInSeconds
    this.scopeRef = map[scope]
    this.redis = new Redis()
  }

  public static async get ({ basePath, expiresInSeconds, scope, ip, clientId, userId }: {
  basePath: string,
  expiresInSeconds: number,
  scope: string,
  ip: string,
  clientId: string,
  userId: string
  }): Promise<RequestInfo | null> {
    const key = RequestInfo.generateKey({
      scope,
      ip,
      clientId,
      userId
    })

    const redis = new Redis()
    const res = await redis.get(key)
    const infoQuery = { basePath, expiresInSeconds, scope, ip, clientId, userId }
    let count = 0

    if (res) {
      const cachedCount = parseInt(res, 10)
      if (!isNaN(cachedCount)) {
        count = cachedCount
      }
    }

    return new RequestInfo({
      ...infoQuery,
      count
    })
  }

  public static generateKey ({ scope, ip, clientId, userId }): string {
    const scopeRef = {
      ip,
      app: clientId,
      user: userId
    }
    return `tanhua;ratelimit;${scope};${scopeRef[scope]}`
  }

  public static reset ({ scope, ip, clientId, userId }): Promise<boolean> {
    const redis = new Redis()

    return new Promise((resolve, reject): void => {
      const key = RequestInfo.generateKey({ scope, ip, clientId, userId })
      redis.connection.expire(key, 0, (error, reply): void => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  public reset (): Promise<boolean> {
    return RequestInfo.reset({
      scope: this.scope,
      ip: this.ip,
      clientId: this.clientId,
      userId: this.userId
    })
  }

  public increment (): Promise<RequestInfo> {
    return new Promise((resolve, reject): void => {
      const key = this.getKey()
      const expiresInSeconds = this.expiresInSeconds
      this.redis.connection.incr(key, (error, reply): void => {
        if (error) {
          reject(error)
        } else {
          if (reply === 1) {
            this.redis.connection.expire(key, expiresInSeconds, (error): void => {
              if (error) {
                reject(error)
              } else {
                resolve(this)
              }
            })
          } else {
            resolve(this)
          }
        }
      })
    })
  }

  protected getKey (): string {
    return RequestInfo.generateKey({
      scope: this.scope,
      ip: this.ip,
      clientId: this.clientId,
      userId: this.userId
    })
  }
}
