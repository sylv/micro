import { Controller, Get, Param } from "@nestjs/common";
import { DeletionService } from "./deletion.service";

@Controller()
export class DeletionController {
  constructor(private deletionService: DeletionService) {}

  @Get("delete/:token")
  async getDeletionPage(@Param("token") token: string) {
    await this.deletionService.useToken(token);
    return { deleted: true };
  }

  @Get("api/delete/:token")
  async getDeletion(@Param("token") token: string) {
    return this.deletionService.verifyToken(token);
  }
}
