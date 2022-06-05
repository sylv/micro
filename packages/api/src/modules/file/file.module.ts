import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { HostModule } from "../host/host.module";
import { Paste } from "../paste/paste.entity";
import { StorageModule } from "../storage/storage.module";
import { UserModule } from "../user/user.module";
import { FileController } from "./file.controller";
import { File } from "./file.entity";
import { FileService } from "./file.service";

@Module({
  imports: [StorageModule, HostModule, UserModule, MikroOrmModule.forFeature([File, Paste])],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
