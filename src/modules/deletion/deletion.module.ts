import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { FileModule } from "../file/file.module";
import { LinkModule } from "../link/link.module";
import { DeletionController } from "./deletion.controller";
import { DeletionService } from "./deletion.service";

@Module({
  controllers: [DeletionController],
  providers: [DeletionService],
  exports: [DeletionService],
  imports: [AuthModule, FileModule, LinkModule],
})
export class DeletionModule {}
