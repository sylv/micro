import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { File } from "../file/file.entity";
import { User } from "./user.entity";
import { AuthModule } from "../auth/auth.module";
import { FileModule } from "../file/file.module";
import { InviteModule } from "../invite/invite.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [forwardRef(() => InviteModule), AuthModule, forwardRef(() => FileModule), MikroOrmModule.forFeature([User, File])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
