import { BaseModelInterface } from '@iredium/butterfly/lib/models'

export interface CredentialInterface extends BaseModelInterface {
  user_id: string;
  client_id: string;
  active: boolean;
  token_type: string;
  token: string;
  refresh_token: string;
  scope: string;
  expires_at: Date;
}
