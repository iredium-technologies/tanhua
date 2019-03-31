import { ApiGateway } from '~/src/api_gateway'
import Butterfly from '@iredium/butterfly'
import config from '~/src/config'
import { apis } from '~/src/config/apis'

const butterfly = new Butterfly(config)

butterfly.hook('butterfly:registerMiddlewares', (app): void => {
  const apiGateway = new ApiGateway(app, apis)
  apiGateway.registerMiddlewares()
})

butterfly.boot()
