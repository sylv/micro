import { Controller, Get, Render } from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { config } from "../config";
import { HostsService } from "./hosts/hosts.service";

@Controller()
export class AppController {
  constructor(private hostsService: HostsService) {}

  @Get()
  @Render("index")
  getHome() {
    return this.getConfig();
  }

  @Get("api/config")
  async getConfig() {
    const hosts = this.hostsService.getHosts([]);
    return {
      inquiries: config.inquiries,
      uploadLimit: config.uploadLimit,
      allowTypes: config.allowTypes,
      hosts: classToPlain(hosts) as typeof hosts,
    };
  }
}
