import { Module } from "@nestjs/common";
import { DeletionModule } from "../deletion/deletion.module";
import { FileModule } from "../file/file.module";
import { LinkModule } from "../link/link.module";
import { ShareXController } from "./sharex.controller";

@Module({
  imports: [FileModule, LinkModule, DeletionModule],
  controllers: [ShareXController],
})
export class ShareXModule {}
