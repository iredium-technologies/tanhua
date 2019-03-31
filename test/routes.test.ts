import Butterfly from '@iredium/butterfly'
import config from '~/src/config'
import request = require('supertest')

const butterfly = new Butterfly(config)
butterfly.boot()

describe('Routes Test', (): void => {
  it('should respond ok for GET /users', async (): Promise<void> => {
    request(butterfly.app).get('/users').expect(200)
  })
})

butterfly.close()
