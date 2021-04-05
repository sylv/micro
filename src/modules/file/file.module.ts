import { forwardRef, Module } from "@nestjs/common";
import { DeletionModule } from "../deletion/deletion.module";
import { StorageModule } from "../storage/storage.module";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";

@Module({
  imports: [StorageModule, forwardRef(() => DeletionModule)],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
