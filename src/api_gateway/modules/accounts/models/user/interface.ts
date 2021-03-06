import { BaseModelInterface } from '@iredium/butterfly/lib/models/base_model_interface'

export interface UserInterface extends BaseModelInterface {
  first_name: string; // eslint-disable-line camelcase
  last_name: string; // eslint-disable-line camelcase
  username: string;
  email: string;
  password: string;
  fullName(): string;
  isAdmin(): boolean;
  isRoot(): boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
