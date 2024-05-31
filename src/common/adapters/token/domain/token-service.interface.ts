import { TokenPayloadType } from './token-payload.type';

export interface TokenServiceInterface {
  generateToken(payload: TokenPayloadType): string;
  verifyToken(token: string): any;
}
