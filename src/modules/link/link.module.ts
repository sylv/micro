import { forwardRef, Module } from "@nestjs/common";
import { DeletionModule } from "../deletion/deletion.module";
import { HostsModule } from "../hosts/hosts.module";
import { LinkController } from "./link.controller";
import { LinkService } from "./link.service";

@Module({
  imports: [forwardRef(() => DeletionModule), HostsModule],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
