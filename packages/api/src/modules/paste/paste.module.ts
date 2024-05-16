import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { HostModule } from "../host/host.module.js";
import { UserModule } from "../user/user.module.js";
import { PasteController } from "./paste.controller.js";
import { PasteEntity } from "./paste.entity.js";
import { PasteResolver } from "./paste.resolver.js";
import { PasteService } from "./paste.service.js";

@Module({
  imports: [MikroOrmModule.forFeature([PasteEntity]), HostModule, UserModule],
  controllers: [PasteController],
  providers: [PasteService, PasteResolver],
})
export class PasteModule {}
