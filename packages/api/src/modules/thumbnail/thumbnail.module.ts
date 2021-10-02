import { Module } from "@nestjs/common";
import { FileModule } from "../file/file.module";
import { StorageModule } from "../storage/storage.module";
import { ThumbnailController } from "./thumbnail.controller";
import { ThumbnailService } from "./thumbnail.service";
import { Thumbnail } from "./thumbnail.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";

@Module({
  imports: [StorageModule, FileModule, MikroOrmModule.forFeature([Thumbnail])],
  controllers: [ThumbnailController],
  providers: [ThumbnailService],
  exports: [ThumbnailService],
})
export class ThumbnailModule {}
