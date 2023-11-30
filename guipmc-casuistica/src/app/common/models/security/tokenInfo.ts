import { Scope } from './scope';

export class TokenInfo {
  scope: Scope;
  issuer: string;
  audience: string;
  expires_in: number;
  user_id: string;
}
