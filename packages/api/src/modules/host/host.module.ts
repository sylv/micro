import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module.js';
import { HostService } from './host.service.js';

@Module({
  imports: [UserModule],
  providers: [HostService],
  exports: [HostService],
})
export class HostModule {}
