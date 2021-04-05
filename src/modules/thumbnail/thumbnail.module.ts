import { Module } from "@nestjs/common";
import { FileModule } from "../file/file.module";
import { StorageModule } from "../storage/storage.module";
import { ThumbnailController } from "./thumbnail.controller";
import { ThumbnailService } from "./thumbnail.service";

@Module({
  imports: [StorageModule, FileModule],
  controllers: [ThumbnailController],
  providers: [ThumbnailService],
  exports: [ThumbnailService],
})
export class ThumbnailModule {}
