import { Controller, Get, Param } from "@nestjs/common";
import { DeletionService } from "../services/DeletionService";

@Controller()
export class DeletionController {
  constructor(private deletionService: DeletionService) {}

  @Get("delete/:token")
  async getDeletionPage(@Param("token") token: string) {
    await this.deletionService.delete(token);
    return { deleted: true };
  }

  @Get("api/delete/:token")
  async getDeletion(@Param("token") token: string) {
    return this.deletionService.verifyDeletionToken(token);
  }
}
