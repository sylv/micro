import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { FastifyRequest } from "fastify";
import { Strategy } from "passport-jwt";
import { config } from "../../../config.js";
import { UserEntity } from "../../user/user.entity.js";
import { TokenType } from "../auth.service.js";
import { AccountDisabledError } from "../account-disabled.error.js";

export interface JWTPayloadUser {
  id: string;
  name: string;
  secret: string;
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  @InjectRepository(UserEntity) private userRepo: EntityRepository<UserEntity>;

  constructor() {
    super({
      audience: TokenType.USER,
      ignoreExpiration: false,
      secretOrKey: config.secret,
      jwtFromRequest: (request: FastifyRequest<{ Querystring: { token?: string } }>) => {
        return request.cookies.token ?? request.query.token ?? request.headers.authorization;
      },
    });
  }

  async validate(payload: JWTPayloadUser): Promise<FastifyRequest["user"]> {
    // todo: payload.secret makes jwts basically useless, but i'm keeping them so we dont break all
    // existing jwt tokens and require configs to be regenerated.
    if (!payload.secret) throw new UnauthorizedException("Outdated JWT - try refresh your session");
    const user = await this.userRepo.findOne({ secret: payload.secret });
    if (!user) throw new UnauthorizedException("Invalid token secret");
    if (user.disabledReason) {
      throw new AccountDisabledError(user.disabledReason);
    }

    return user;
  }
}
