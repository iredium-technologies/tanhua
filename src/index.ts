import { ApiGateway } from '~/src/api_gateway'
import Butterfly from '@iredium/butterfly'
import config from '~/src/config'
import apiGatewayConfig from '~/src/api_gateway/config'

const butterfly = new Butterfly(config)

let apiGateway = new ApiGateway(butterfly.app, apiGatewayConfig)

apiGateway.init()
  .then((): void => {
    butterfly.boot()
  })
