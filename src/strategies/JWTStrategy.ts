import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { FastifyRequest } from "fastify";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from "../config";
import { TokenType } from "../modules/auth/auth.service";

export interface JWTPayloadUser {
  sub: string;
  name: string;
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      audience: TokenType.USER,
      ignoreExpiration: false,
      secretOrKey: config.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), (req) => req.cookies.token]),
    });
  }

  validate(payload: JWTPayloadUser): FastifyRequest["user"] {
    return {
      id: payload.sub,
      username: payload.name,
    };
  }
}
