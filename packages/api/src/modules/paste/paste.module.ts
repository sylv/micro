import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PasteController } from "./paste.controller";
import { Paste } from "./paste.entity";
import { PasteService } from "./paste.service";

@Module({
  imports: [MikroOrmModule.forFeature([Paste])],
  controllers: [PasteController],
  providers: [PasteService],
})
export class PasteModule {}
