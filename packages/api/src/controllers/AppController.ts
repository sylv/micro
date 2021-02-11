import { Controller, Get, Render } from "@nestjs/common";
import { config } from "../config";
import { Await } from "../types";

export type ConfigResponse = Await<ReturnType<AppController["getConfig"]>>;

@Controller()
export class AppController {
  @Get("/")
  @Render("index")
  getHome() {
    return {
      domains: config.domains,
    };
  }

  @Get("/api/config")
  getConfig() {
    return {
      domains: config.domains,
    };
  }
}
