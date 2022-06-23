import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import bcrypt from 'bcrypt';
import type { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-local';
import { User } from '../../user/user.entity';

@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly userRepo: EntityRepository<User>) {
    super();
  }

  async validate(username: string, password: string): Promise<FastifyRequest['user']> {
    const lowerUsername = username.toLowerCase();
    const user = await this.userRepo.findOne({
      username: lowerUsername,
    });

    if (!user) throw new UnauthorizedException();
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new UnauthorizedException();
    return user;
  }
}
