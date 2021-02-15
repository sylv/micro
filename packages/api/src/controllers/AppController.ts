import { Controller, Get, Render } from "@nestjs/common";
import { config } from "../config";

@Controller()
export class AppController {
  @Get()
  @Render("index")
  getHome() {
    return this.getConfig();
  }

  @Get("api/config")
  getConfig() {
    return {
      inquires: config.inquires,
      domains: config.domains,
    };
  }
}
