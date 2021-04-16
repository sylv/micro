import { Controller, Get, Render, UseInterceptors } from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { MicroHost } from "../classes/MicroHost";
import { config } from "../config";
import { RedirectInterceptor } from "../interceptors/redirect.interceptor";
import { UserId } from "./auth/auth.decorators";
import { HostsService } from "./hosts/hosts.service";

@Controller()
@UseInterceptors(RedirectInterceptor)
export class AppController {
  constructor(private hostService: HostsService) {}

  @Get()
  @Render("index")
  getHome() {
    return this.getConfig();
  }

  @Get("api/config")
  async getConfig() {
    const hosts = this.hostService.get([]);
    return {
      inquiries: config.inquiries,
      uploadLimit: config.uploadLimit,
      allowTypes: config.allowTypes,
      hosts: classToPlain(hosts) as typeof hosts,
    };
  }
}
