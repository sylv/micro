import { forwardRef, Module } from "@nestjs/common";
import { FileModule } from "../file/file.module";
import { InviteModule } from "../invite/invite.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [forwardRef(() => InviteModule), FileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
