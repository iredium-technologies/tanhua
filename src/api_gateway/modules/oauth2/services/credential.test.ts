import { ApplicationService } from './application'
import { CredentialService } from './credential'
import { initTest } from '~/test/helpers/init-test'

initTest()

const credentials = new CredentialService()
const applications = new ApplicationService()
let clientId = `test_client_id_${Date.now()}`
let clientSecret = `test_client_secret_${Date.now()}`
let clientId2 = `${clientId}-2`
let clientSecret2 = `${clientId}-2`

describe('Credential Fields Test', async (): Promise<void> => {
  let credential = null

  beforeAll(async (): Promise<void> => {
    await applications.create({
      name: `test_application_${Date.now()}`,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: 'http://localhost'
    })
    await applications.create({
      name: `test_application_${Date.now()}`,
      client_id: clientId2,
      client_secret: clientSecret2,
      redirect_uris: 'http://localhost'
    })
    credential = await credentials.create({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'public'
    })
  })

  it('should has field _id ', async (): Promise<void> => {
    expect(credential._id).toBeDefined()
  })

  it('should has field token_type ', async (): Promise<void> => {
    expect(credential.token_type).toBeDefined()
  })

  it('should has field token ', async (): Promise<void> => {
    expect(credential.token).toBeDefined()
  })

  it('should has field expires_at ', async (): Promise<void> => {
    expect(credential.expires_at).toBeDefined()
  })
})

describe('Issue Credential Test', async (): Promise<void> => {
  it('should issues different credential for each clientId', async (): Promise<void> => {
    const credential = await credentials.create({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'public'
    })

    const credential2 = await credentials.create({
      grant_type: 'client_credentials',
      client_id: clientId2,
      client_secret: clientSecret2,
      scope: 'public'
    })
    expect(credential._id.toString() !== credential2._id.toString()).toBeTruthy()
  })

  it('should expires in 120 minutes', async (): Promise<void> => {
    const credential = await credentials.create({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'public'
    })
    const now = new Date()
    const expiresAt = new Date(credential.expires_at)
    const diff = expiresAt.getTime() - now.getTime()
    expect(Math.ceil(diff / 60000)).toBe(120)
  })

  it('should issues non-refreshable credential for client credentials grant', async (): Promise<void> => {
    const credential = await credentials.create({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'public'
    })
    expect(credential.refresh_token).toBeFalsy()
  })

  it('should issues refreshable credential for password grant', async (): Promise<void> => {
    const credential = await credentials.create({
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      authenticated_user_id: 'user_123',
      scope: 'public'
    })
    expect(credential.refresh_token).toBeDefined()
  })

  it('should issues different refreshable credential for password grant for each user', async (): Promise<void> => {
    const credential1 = await credentials.create({
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      authenticated_user_id: 'user_123',
      scope: 'public'
    })
    const credential2 = await credentials.create({
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      authenticated_user_id: 'user_124',
      scope: 'public'
    })
    expect(credential1.token === credential2.token).toBeFalsy()
  })

  it('should issues refreshable credential for refresh grant with authenticated_user_id', async (): Promise<void> => {
    const credential = await credentials.create({
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      authenticated_user_id: 'user_123',
      scope: 'public'
    })
    const refreshedCredential = await credentials.create({
      grant_type: 'refresh_token',
      refresh_token: credential.refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'public'
    })
    expect(refreshedCredential.refresh_token).toBeDefined()
  })

  it('should able to refreshes token only once', async (): Promise<void> => {
    const credential = await credentials.create({
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      authenticated_user_id: 'user_123',
      scope: 'public'
    })
    await credentials.create({
      grant_type: 'refresh_token',
      refresh_token: credential.refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'public'
    })
    try {
      await credentials.create({
        grant_type: 'refresh_token',
        refresh_token: credential.refresh_token,
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'public'
      })
      fail('credential was issued multiple times')
    } catch (e) {
      expect(e.stack).toBeDefined()
    }
  })
})
