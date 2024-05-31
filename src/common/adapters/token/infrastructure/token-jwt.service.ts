import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadType, TokenServiceInterface } from '../domain';

@Injectable()
export class TokenJwtService implements TokenServiceInterface {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: TokenPayloadType): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new Error('Invalid token');
    }
  }
}
