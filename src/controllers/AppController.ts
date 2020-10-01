import { Controller, Get } from "@nestjs/common";
import { config } from "../config";

@Controller()
export class AppController {
  @Get("/")
  getConfig() {
    return {
      domains: config.domains,
    };
  }
}
