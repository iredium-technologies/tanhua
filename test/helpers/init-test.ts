import Butterfly from '@iredium/butterfly'
import config from '~/src/api_gateway/config'

export function initTest (): Butterfly {
  const butterfly = new Butterfly(config)

  beforeAll(async (): Promise<void> => {
    await butterfly.boot()
  })

  afterAll(async (): Promise<void> => {
    await butterfly.close()
  })

  return butterfly
}
