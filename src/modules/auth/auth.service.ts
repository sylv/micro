import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export enum TokenType {
  USER = "USER",
  DELETION = "DELETION",
  INVITE = "INVITE",
}

export interface TokenPayload {
  aud: TokenType;
  exp: number;
  iat: number;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signToken<PayloadType extends Record<string, any>>(type: TokenType, payload: PayloadType, expiresIn = "1y") {
    return this.jwtService.signAsync(payload, {
      audience: type,
      expiresIn: expiresIn,
    });
  }

  async verifyToken<Payload extends Record<string, any>>(type: TokenType, token: string): Promise<Payload & TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<Payload & TokenPayload>(token, {
        audience: type,
      });
    } catch {
      throw new BadRequestException("Token validation failed.");
    }
  }
}
