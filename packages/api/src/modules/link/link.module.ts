import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { HostModule } from '../host/host.module.js';
import { UserModule } from '../user/user.module.js';
import { LinkController } from './link.controller.js';
import { Link } from './link.entity.js';
import { LinkResolver } from './link.resolver.js';
import { LinkService } from './link.service.js';

@Module({
  imports: [LinkModule, UserModule, HostModule, MikroOrmModule.forFeature([Link])],
  controllers: [LinkController],
  providers: [LinkService, LinkResolver],
  exports: [LinkService],
})
export class LinkModule {}
