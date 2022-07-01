import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { HostModule } from '../host/host.module';
import { UserModule } from '../user/user.module';
import { LinkController } from './link.controller';
import { Link } from './link.entity';
import { LinkResolver } from './link.resolver';
import { LinkService } from './link.service';

@Module({
  imports: [LinkModule, UserModule, HostModule, MikroOrmModule.forFeature([Link])],
  controllers: [LinkController],
  providers: [LinkService, LinkResolver],
  exports: [LinkService],
})
export class LinkModule {}
