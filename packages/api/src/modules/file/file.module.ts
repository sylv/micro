import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { HostModule } from '../host/host.module.js';
import { LinkModule } from '../link/link.module.js';
import { Paste } from '../paste/paste.entity.js';
import { StorageModule } from '../storage/storage.module.js';
import { UserModule } from '../user/user.module.js';
import { FileController } from './file.controller.js';
import { File } from './file.entity.js';
import { FileResolver } from './file.resolver.js';
import { FileService } from './file.service.js';

@Module({
  imports: [StorageModule, HostModule, UserModule, LinkModule, MikroOrmModule.forFeature([File, Paste])],
  controllers: [FileController],
  providers: [FileService, FileResolver],
  exports: [FileService],
})
export class FileModule {}
