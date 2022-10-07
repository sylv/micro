import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../../config.js';
import { User } from '../user/user.entity.js';
import { AuthResolver } from './auth.resolver.js';
import { AuthService } from './auth.service.js';
import { JWTStrategy } from './strategies/jwt.strategy.js';

@Module({
  providers: [AuthResolver, AuthService, JWTStrategy],
  exports: [AuthService],
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.register({
      secret: config.secret,
    }),
  ],
})
export class AuthModule {}
