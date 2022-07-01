import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { InviteController } from './invite.controller';
import { Invite } from './invite.entity';
import { InviteResolver } from './invite.resolver';
import { InviteService } from './invite.service';

@Module({
  controllers: [InviteController],
  imports: [forwardRef(() => UserModule), AuthModule, MikroOrmModule.forFeature([User, Invite])],
  providers: [InviteService, InviteResolver],
  exports: [InviteService],
})
export class InviteModule {}
