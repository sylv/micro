import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { FileEntity } from "../file/file.entity.js";
import { FileModule } from "../file/file.module.js";
import { StorageModule } from "../storage/storage.module.js";
import { ThumbnailController } from "./thumbnail.controller.js";
import { ThumbnailEntity } from "./thumbnail.entity.js";
import { ThumbnailService } from "./thumbnail.service.js";

@Module({
  imports: [StorageModule, FileModule, MikroOrmModule.forFeature([ThumbnailEntity, FileEntity])],
  controllers: [ThumbnailController],
  providers: [ThumbnailService],
  exports: [ThumbnailService],
})
export class ThumbnailModule {}
