import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { File } from '../file/file.entity.js';
import { FileModule } from '../file/file.module.js';
import { InviteModule } from '../invite/invite.module.js';
import { Paste } from '../paste/paste.entity.js';
import { UserVerification } from './user-verification.entity.js';
import { UserController } from './user.controller.js';
import { User } from './user.entity.js';
import { UserResolver } from './user.resolver.js';
import { UserService } from './user.service.js';

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
