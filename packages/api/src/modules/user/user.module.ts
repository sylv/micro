import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { File } from '../file/file.entity';
import { FileModule } from '../file/file.module';
import { InviteModule } from '../invite/invite.module';
import { Paste } from '../paste/paste.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => InviteModule),
    AuthModule,
    forwardRef(() => FileModule),
    MikroOrmModule.forFeature([User, File, Paste]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
