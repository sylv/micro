import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { FastifyRequest } from "fastify";
import { Strategy } from "passport-jwt";
import { config } from "../config";
import { TokenType } from "../modules/auth/auth.service";
import { prisma } from "../prisma";

export interface JWTPayloadUser {
  id: string;
  name: string;
  secret: string;
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      audience: TokenType.USER,
      ignoreExpiration: false,
      secretOrKey: config.secret,
      jwtFromRequest: (req: FastifyRequest) => req.cookies.token || req.headers["authorization"],
    });
  }

  async validate(payload: JWTPayloadUser): Promise<FastifyRequest["user"]> {
    // requiring payload.secret does more or less make JWTs useless to us
    // but they're convenient so why not keep them, in the future this requirement
    // might be removed.
    if (!payload.secret) throw new ForbiddenException("Outdated JWT - refresh your sesion.");
    const user = await prisma.user.findFirst({ where: { secret: payload.secret } });
    if (!user) throw new ForbiddenException("Invalid token secret.");
    return user;
  }
}
