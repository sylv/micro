import { Module } from "@nestjs/common";
import { StorageService } from "./storage.service.js";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { File } from "../file/file.entity.js";

@Module({
  providers: [StorageService],
  exports: [StorageService],
  imports: [MikroOrmModule.forFeature([File])],
})
export class StorageModule {}
