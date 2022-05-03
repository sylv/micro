import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { File } from "../file/file.entity";
import { FileModule } from "../file/file.module";
import { StorageModule } from "../storage/storage.module";
import { ThumbnailController } from "./thumbnail.controller";
import { Thumbnail } from "./thumbnail.entity";
import { ThumbnailService } from "./thumbnail.service";

@Module({
  imports: [StorageModule, FileModule, MikroOrmModule.forFeature([Thumbnail, File])],
  controllers: [ThumbnailController],
  providers: [ThumbnailService],
  exports: [ThumbnailService],
})
export class ThumbnailModule {}
