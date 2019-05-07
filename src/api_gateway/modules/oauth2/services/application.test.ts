import { ApplicationService } from './application'
import { initTest } from '~/test/helpers/init-test'

initTest()

const applications = new ApplicationService()

describe('Credential Fields Test', (): void => {
  let application = null

  beforeAll(async (): Promise<void> => {
    application = await applications.create({
      name: `test_application_${Date.now()}`,
      redirect_uris: 'http://localhost',
      scope: 'user'
    })
  })

  it('should has field _id ', async (): Promise<void> => {
    expect(application._id).toBeDefined()
  })

  it('should has field name ', async (): Promise<void> => {
    expect(application.name).toBeDefined()
  })

  it('should has field redirect_uris ', async (): Promise<void> => {
    expect(application.redirect_uris).toBeDefined()
  })

  it('should has field client_id ', async (): Promise<void> => {
    expect(application.client_id).toBeDefined()
  })

  it('should has field client_secret ', async (): Promise<void> => {
    expect(application.client_secret).toBeDefined()
  })

  it('should has field active ', async (): Promise<void> => {
    expect(application.active).toBeDefined()
  })
})
