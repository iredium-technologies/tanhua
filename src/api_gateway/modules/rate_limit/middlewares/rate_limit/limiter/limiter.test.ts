import { initTest } from '~/test/helpers/init-test'
import { Limiter } from './limiter'

initTest()

const max = 10
const window = 1

function generateQuery (loggedIn = false): {
  basePath: string,
  ip: string,
  clientId: string,
  userId: string,
  expiresInSeconds: number } {
  const d = new Date()
  return {
    basePath: '/limiter-test-api',
    ip: `192.168.95.1-${d.getTime()}`,
    clientId: `limiter-awesome-app-${d.getTime()}`,
    userId: loggedIn ? `limiter-user-${d.getTime()}` : null,
    expiresInSeconds: 60
  }
}

const limiterUserConstructor = {
  max: max,
  window,
  scope: 'user'
}

const limiterAppConstructor = {
  max: max + 1,
  window,
  scope: 'app'
}

const limiterIpConstructor = {
  max: max + 2,
  window,
  scope: 'ip'
}

describe('Limiter Test', (): void => {
  it('should have count property', async (): Promise<void> => {
    let limiter: Limiter = new Limiter(limiterUserConstructor)
    expect(limiter.count).toBeDefined()
  })

  it('should have performLmit method', async (): Promise<void> => {
    let limiter: Limiter = new Limiter(limiterUserConstructor)
    expect(limiter.performLimit).toBeDefined()
  })

  it('should fail if ip limiter total count > max', async (): Promise<void> => {
    const query = generateQuery(true)
    let limiter: Limiter = new Limiter(limiterUserConstructor)
    for (let i = 0; i < limiterUserConstructor.max; i++) {
      await limiter.performLimit(query)
    }

    await expect(limiter.performLimit(query)).rejects.toThrow('Rate limit exceeded')
  })

  it('should fail if app limiter total count > max', async (): Promise<void> => {
    const query = generateQuery()
    let limiter: Limiter = new Limiter(limiterAppConstructor)
    for (let i = 0; i < limiterAppConstructor.max; i++) {
      await limiter.performLimit(query)
    }

    await expect(limiter.performLimit(query)).rejects.toThrow('Rate limit exceeded')
  })

  it('should fail if user limiter total count > max', async (): Promise<void> => {
    const query = generateQuery(true)
    let limiter: Limiter = new Limiter(limiterUserConstructor)
    for (let i = 0; i < limiterUserConstructor.max; i++) {
      await limiter.performLimit(query)
    }

    await expect(limiter.performLimit(query)).rejects.toThrow('Rate limit exceeded')
  })

  it('should fail if app limiter total count > max', async (): Promise<void> => {
    const query = generateQuery()
    let limiter: Limiter = new Limiter(limiterAppConstructor)
    for (let i = 0; i < limiterAppConstructor.max; i++) {
      await limiter.performLimit(query)
    }

    await expect(limiter.performLimit(query)).rejects.toThrow('Rate limit exceeded')
  })

  it('should fail if user limiter total count > max', async (): Promise<void> => {
    const query = generateQuery(true)
    let limiter: Limiter = new Limiter(limiterUserConstructor)
    for (let i = 0; i < limiterUserConstructor.max; i++) {
      await limiter.performLimit(query)
    }

    await expect(limiter.performLimit(query)).rejects.toThrow('Rate limit exceeded')
  })

  it('should always 0 count for invalid query', async (): Promise<void> => {
    const query = {
      ...generateQuery(),
      ip: null,
      clientId: null,
      userId: null
    }
    let limiterIp: Limiter = new Limiter(limiterIpConstructor)
    let limiterUser: Limiter = new Limiter(limiterUserConstructor)
    let limiterApp: Limiter = new Limiter(limiterAppConstructor)

    for (let i = 0; i < limiterUserConstructor.max; i++) {
      await limiterIp.performLimit(query)
      await limiterUser.performLimit(query)
      await limiterApp.performLimit(query)
    }

    const counts = [
      limiterIp.count,
      limiterApp.count,
      limiterUser.count
    ]

    expect(JSON.stringify(counts)).toEqual(JSON.stringify([0, 0, 0]))
  })

  it('should store ip, app and user\'s count seperately', async (): Promise<void> => {
    const max = limiterUserConstructor.max
    const query = generateQuery()
    const loggedInQuery = generateQuery(true)
    let limiterIp: Limiter = new Limiter(limiterIpConstructor)
    let limiterUser: Limiter = new Limiter(limiterUserConstructor)
    let limiterApp: Limiter = new Limiter(limiterAppConstructor)

    for (let i = 0; i < max; i++) {
      await limiterIp.performLimit(query)
      await limiterApp.performLimit(query)
      await limiterUser.performLimit(loggedInQuery)
    }

    const counts = [
      limiterIp.count,
      limiterUser.count,
      limiterApp.count
    ]

    expect(JSON.stringify(counts)).toEqual(JSON.stringify([max, max, max]))
  })

  it('should ignore count for app limiter using login query', async (): Promise<void> => {
    const loggedInQuery = generateQuery(true)
    let limiter: Limiter = new Limiter(limiterAppConstructor)

    for (let i = 0; i < limiterAppConstructor.max; i++) {
      await limiter.performLimit(loggedInQuery)
    }

    expect(limiter.count).toEqual(0)
  })

  it('should ignore count for user limiter using non-login query', async (): Promise<void> => {
    const query = generateQuery()
    let limiter: Limiter = new Limiter(limiterUserConstructor)

    for (let i = 0; i < limiterUserConstructor.max; i++) {
      await limiter.performLimit(query)
    }

    expect(limiter.count).toEqual(0)
  })
})
