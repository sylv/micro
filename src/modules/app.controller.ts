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
      host: config.host,
      inquiries: config.inquiries,
      hosts: config.hosts,
    };
  }
}
