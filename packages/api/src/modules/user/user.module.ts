import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { File } from '../file/file.entity';
import { FileModule } from '../file/file.module';
import { InviteModule } from '../invite/invite.module';
import { Paste } from '../paste/paste.entity';
import { UserVerification } from './user-verification.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => InviteModule),
    forwardRef(() => FileModule),
    AuthModule,
    MikroOrmModule.forFeature([User, UserVerification, File, Paste]),
  ],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
