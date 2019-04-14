import { initTest } from '~/test/helpers/init-test'
import request = require('supertest')

const butterfly = initTest()

describe('Routes Test', (): void => {
  it('should respond 200 for GET /users', async (): Promise<void> => {
    request(butterfly.app).get('/users').expect(200)
  })

  it('should respond 404 for GET /no-found-route', async (): Promise<void> => {
    request(butterfly.app).get('/no-found-route').expect(404)
  })
})
