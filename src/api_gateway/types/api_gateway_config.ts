import { ApiConfig } from '~/src/api_gateway/types/api_config'

export interface ApiGatewayConfig {
  apis: ApiConfig;
  modules?: Array<string>;
}
