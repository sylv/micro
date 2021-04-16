import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { FileModule } from "../file/file.module";
import { InviteModule } from "../invite/invite.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [forwardRef(() => InviteModule), AuthModule, forwardRef(() => FileModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
