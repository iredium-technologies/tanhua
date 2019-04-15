import { ApiConfig } from '~/src/api_gateway/types/api_config'
import { Class } from '@iredium/butterfly/lib/types/class'

export interface ApiGatewayConfig {
  apis: ApiConfig;
  modules?: Array<string>;
  userServiceClass: Class;
}
