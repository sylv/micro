import { Module } from "@nestjs/common";
import { DeletionModule } from "../deletion/deletion.module";
import { FileModule } from "../file/file.module";
import { HostsModule } from "../hosts/hosts.module";
import { LinkModule } from "../link/link.module";
import { UserModule } from "../user/user.module";
import { ShareXController } from "./sharex.controller";

@Module({
  imports: [UserModule, HostsModule, FileModule, LinkModule, DeletionModule],
  controllers: [ShareXController],
})
export class ShareXModule {}
