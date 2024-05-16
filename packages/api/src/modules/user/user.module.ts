import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { FileEntity } from "../file/file.entity.js";
import { FileModule } from "../file/file.module.js";
import { InviteModule } from "../invite/invite.module.js";
import { PasteEntity } from "../paste/paste.entity.js";
import { UserVerificationEntity } from "./user-verification.entity.js";
import { UserController } from "./user.controller.js";
import { UserEntity } from "./user.entity.js";
import { UserResolver } from "./user.resolver.js";
import { UserService } from "./user.service.js";

@Module({
  imports: [
    forwardRef(() => InviteModule),
    forwardRef(() => FileModule),
    AuthModule,
    MikroOrmModule.forFeature([UserEntity, UserVerificationEntity, FileEntity, PasteEntity]),
  ],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
