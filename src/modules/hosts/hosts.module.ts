import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { HostsController } from "./hosts.controller";
import { HostsService } from "./hosts.service";

@Module({
  imports: [UserModule],
  controllers: [HostsController],
  providers: [HostsService],
  exports: [HostsService],
})
export class HostsModule {}
