import Butterfly from '@iredium/butterfly'
import config from '~/src/api_gateway/config'

export const butterfly = new Butterfly(config)

export function initTest (): Butterfly {
  beforeAll(async (): Promise<void> => {
    process.env.PORT = `${Math.floor(3000 + Math.random() * 1000)}` // TODO: find a better way to handle this
    await butterfly.boot()
  })

  afterAll(async (): Promise<void> => {
    await butterfly.close()
  })

  return butterfly
}
