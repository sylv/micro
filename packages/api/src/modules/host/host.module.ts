import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { HostService } from "./host.service";

@Module({
  imports: [UserModule],
  providers: [HostService],
  exports: [HostService],
})
export class HostModule {}
