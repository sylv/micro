import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-jwt';
import { config } from '../../../config';
import { User } from '../../user/user.entity';
import { TokenType } from '../auth.service';

export interface JWTPayloadUser {
  id: string;
  name: string;
  secret: string;
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly userRepo: EntityRepository<User>) {
    super({
      audience: TokenType.USER,
      ignoreExpiration: false,
      secretOrKey: config.secret,
      jwtFromRequest: (request: FastifyRequest<{ Querystring: { token?: string } }>) =>
        request.cookies.token ?? request.query.token ?? request.headers.authorization,
    });
  }

  async validate(payload: JWTPayloadUser): Promise<FastifyRequest['user']> {
    // requiring payload.secret does more or less make JWTs useless to us
    // but they're convenient so why not keep them, in the future this requirement
    // might be removed.
    if (!payload.secret) throw new ForbiddenException('Outdated JWT - refresh your sesion.');
    const user = await this.userRepo.findOne({ secret: payload.secret });
    if (!user) throw new ForbiddenException('Invalid token secret.');
    return user;
  }
}
