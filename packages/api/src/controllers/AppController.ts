import { Controller, Get } from "@nestjs/common";
import { config } from "../config";

export type ConfigResponse = ReturnType<AppController["getConfig"]>;

@Controller()
export class AppController {
  @Get("/config")
  getConfig() {
    return {
      domains: config.domains,
    };
  }
}
