import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { File } from '../file/file.entity.js';
import { FileModule } from '../file/file.module.js';
import { StorageModule } from '../storage/storage.module.js';
import { ThumbnailController } from './thumbnail.controller.js';
import { Thumbnail } from './thumbnail.entity.js';
import { ThumbnailService } from './thumbnail.service.js';

@Module({
  imports: [StorageModule, FileModule, MikroOrmModule.forFeature([Thumbnail, File])],
  controllers: [ThumbnailController],
  providers: [ThumbnailService],
  exports: [ThumbnailService],
})
export class ThumbnailModule {}
