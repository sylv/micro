import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { HostModule } from '../host/host.module';
import { UserModule } from '../user/user.module';
import { PasteController } from './paste.controller';
import { Paste } from './paste.entity';
import { PasteService } from './paste.service';

@Module({
  imports: [MikroOrmModule.forFeature([Paste]), HostModule, UserModule],
  controllers: [PasteController],
  providers: [PasteService],
})
export class PasteModule {}
