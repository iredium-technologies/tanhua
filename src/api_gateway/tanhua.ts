import { ApiGateway } from '~/src/api_gateway/api_gateway'
import Butterfly from '@iredium/butterfly'
import config from '~/src/api_gateway/config'
import apiGatewayConfig from '~/src/api_gateway/api_gateway_config'

export class Tanhua {
  protected butterfly: Butterfly
  protected apiGateway: ApiGateway

  public constructor () {
    this.butterfly = new Butterfly(config)
    this.apiGateway = new ApiGateway(this.butterfly, apiGatewayConfig)

    this.butterfly.hook('butterfly:ready', ({ port }) => {
      console.log(`Tanhua is running on port ${port}`)
    })
  }

  public boot (): void {
    this.apiGateway.init()
      .then((): void => {
        this.butterfly.boot()
      })
  }
}
