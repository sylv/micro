import { Module } from '@nestjs/common';
import { StorageService } from './storage.service.js';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
