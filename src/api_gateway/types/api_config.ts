export interface Api {
  uris: Array<string>; host: string; config: object;
}

export interface ApiConfig extends Array<Api> {
  _?: string;
}
