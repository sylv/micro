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

  signToken<PayloadType extends {}>(type: TokenType, payload: PayloadType, expiresIn = "1y") {
    return this.jwtService.signAsync(payload, {
      audience: type,
      expiresIn: expiresIn,
    });
  }

  async verifyToken<Payload extends {}>(type: TokenType, token: string): Promise<Payload & TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<Payload & TokenPayload>(token, {
        audience: type,
      });
    } catch (e) {
      throw new BadRequestException("Token validation failed.");
    }
  }
}
