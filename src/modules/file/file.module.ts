import { forwardRef, Module } from "@nestjs/common";
import { DeletionModule } from "../deletion/deletion.module";
import { HostsModule } from "../hosts/hosts.module";
import { StorageModule } from "../storage/storage.module";
import { UserModule } from "../user/user.module";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";

@Module({
  imports: [forwardRef(() => DeletionModule), StorageModule, HostsModule, UserModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
