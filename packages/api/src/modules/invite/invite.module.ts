import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { User } from "../user/user.entity";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { InviteController } from "./invite.controller";
import { InviteService } from "./invite.service";
import { Invite } from "./invite.entity";

@Module({
  imports: [forwardRef(() => UserModule), AuthModule, MikroOrmModule.forFeature([User, Invite])],
  controllers: [InviteController],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
