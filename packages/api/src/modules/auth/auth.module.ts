import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../../config';
import { AuthService } from './auth.service';
import { JWTStrategy } from './strategies/jwt.strategy';
import { User } from '../user/user.entity';
import { AuthResolver } from './auth.resolver';

@Module({
  controllers: [],
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
