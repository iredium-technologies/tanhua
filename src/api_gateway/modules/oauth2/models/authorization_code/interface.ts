import { BaseModelInterface } from '@iredium/butterfly/lib/models'

export interface AuthorizationCodeInterface extends BaseModelInterface {
  client_id: string;
  user_id: string;
  code: string;
  scope: string;
  redirect_uri: string;
  active: boolean;
  expires_at: Date;
}
