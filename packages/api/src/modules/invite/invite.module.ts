import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { UserEntity } from "../user/user.entity.js";
import { UserModule } from "../user/user.module.js";
import { InviteController } from "./invite.controller.js";
import { InviteEntity } from "./invite.entity.js";
import { InviteResolver } from "./invite.resolver.js";
import { InviteService } from "./invite.service.js";

@Module({
  controllers: [InviteController],
  imports: [forwardRef(() => UserModule), AuthModule, MikroOrmModule.forFeature([UserEntity, InviteEntity])],
  providers: [InviteService, InviteResolver],
  exports: [InviteService],
})
export class InviteModule {}
