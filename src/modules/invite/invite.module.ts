import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { InviteController } from "./invite.controller";
import { InviteService } from "./invite.service";

@Module({
  imports: [forwardRef(() => UserModule), AuthModule],
  controllers: [InviteController],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
