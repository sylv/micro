import { Controller, Get, Render } from "@nestjs/common";
import { config } from "../config";
import { GetServerConfigData } from "../types";

@Controller()
export class AppController {
  @Get()
  @Render("index")
  getHome() {
    return this.getConfig();
  }

  @Get("api/config")
  getConfig(): GetServerConfigData {
    return {
      host: config.host,
      inquiries: config.inquiries,
      hosts: config.hosts,
    };
  }
}
