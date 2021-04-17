import { Controller, Get, UseGuards } from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { JWTAuthGuard } from "../../guards/jwt.guard";
import { UserId } from "../auth/auth.decorators";
import { UserService } from "../user/user.service";
import { HostsService } from "./hosts.service";

@Controller("api/hosts")
export class HostsController {
  constructor(private userService: UserService, private hostsService: HostsService) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  async getHosts(@UserId() userId: string) {
    const user = await this.userService.getUser(userId);
    const hosts = this.hostsService.getHosts(user.tags);
    return classToPlain(hosts);
  }
}
