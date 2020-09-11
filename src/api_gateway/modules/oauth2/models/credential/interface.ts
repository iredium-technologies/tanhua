import { BaseModelInterface } from '@iredium/butterfly/lib/models'

export interface CredentialInterface extends BaseModelInterface {
  user_id: string;
  active: boolean;
  client_id: string;
  token_type: string;
  token: string;
  refresh_token: string;
  scope: string;
  expires_at: Date;
}
