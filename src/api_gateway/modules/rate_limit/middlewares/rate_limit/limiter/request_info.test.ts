import { initTest } from '~/test/helpers/init-test'
import { RequestInfo } from './request_info'

initTest()

const basePath = '/test-api'
const expiresInSeconds = 60

const query = {
  ip: '192.168.95.1',
  clientId: 'awesome-app',
  userId: 'user-123'
}

let requestInfoIp: RequestInfo | null = new RequestInfo({
  basePath,
  scope: 'ip',
  count: 0,
  expiresInSeconds,
  ...query
})

describe('Request Info Test', (): void => {
  it('should have field count', async (): Promise<void> => {
    expect(requestInfoIp.count).toBeDefined()
  })

  it('should have field scopeRef', async (): Promise<void> => {
    expect(requestInfoIp.scopeRef).toBeDefined()
  })

  it('should have field key', async (): Promise<void> => {
    expect(requestInfoIp.key).toBeDefined()
  })

  it('should generate ip key correctly', async (): Promise<void> => {
    const key = RequestInfo.generateKey({
      scope: 'ip',
      ...query
    })
    expect(key).toEqual(`tanhua;ratelimit;ip;${query.ip}`)
  })

  it('should generate app key correctly', async (): Promise<void> => {
    const key = RequestInfo.generateKey({
      scope: 'app',
      ...query
    })
    expect(key).toEqual(`tanhua;ratelimit;app;${query.clientId}`)
  })

  it('should generate user key correctly', async (): Promise<void> => {
    const key = RequestInfo.generateKey({
      scope: 'user',
      ...query
    })
    expect(key).toEqual(`tanhua;ratelimit;user;${query.userId}`)
  })

  it('should increment correctly', async (): Promise<void> => {
    const oldCount = requestInfoIp.count
    await requestInfoIp.increment()
    expect(requestInfoIp.count).toEqual(oldCount + 1)
  })

  it('should read stored value correctly', async (): Promise<void> => {
    const count = (await requestInfoIp.increment()).count
    const requestInfo = await RequestInfo.get({
      basePath,
      expiresInSeconds,
      scope: 'ip',
      ...query
    })
    expect(requestInfo.count).toEqual(count)
  })

  it('should reset stored value correctly', async (): Promise<void> => {
    await requestInfoIp.increment()
    await requestInfoIp.reset()
    const requestInfo = await RequestInfo.get({
      basePath,
      expiresInSeconds,
      scope: 'ip',
      ...query
    })
    expect(requestInfo.count).toEqual(0)
  })
})
