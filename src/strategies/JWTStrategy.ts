import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from "../config";
import { FastifyRequest } from "fastify";
import { TokenAudience } from "../constants";

export interface JWTPayloadUser {
  sub: string;
  name: string;
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      audience: TokenAudience.USER,
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
