import { ApiGateway } from '~/src/api_gateway'
import Butterfly from '@iredium/butterfly'
import config from '~/src/config'
import apiGatewayConfig from '~/src/api_gateway/config'

const butterfly = new Butterfly(config)

butterfly.hook('butterfly:registerMiddlewares', (app): void => {
  const apiGateway = new ApiGateway(app, apiGatewayConfig)
  apiGateway.init()
})

butterfly.boot()
