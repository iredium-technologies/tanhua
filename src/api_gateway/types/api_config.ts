export interface ApiRateLimitConfig {
  scope: string;
  window: number;
  max: number;
}

export interface Api {
  host: string;
  uris: Array<string>;
  config: object;
  rateLimit: ApiRateLimitConfig[];
}

export interface ApiConfig extends Array<Api> {
  _?: string;
}
