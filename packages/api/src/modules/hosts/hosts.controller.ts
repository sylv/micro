import { Controller, ForbiddenException, Get, UseGuards } from "@nestjs/common";
import { UserId } from "../auth/auth.decorators";
import { JWTAuthGuard } from "../auth/guards/jwt.guard";
import { UserService } from "../user/user.service";
import { HostsService } from "./hosts.service";

@Controller("hosts")
export class HostsController {
  constructor(private userService: UserService, private hostsService: HostsService) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  async getHosts(@UserId() userId: string) {
    const user = await this.userService.getUser(userId);
    if (!user) throw new ForbiddenException("Unknown user.");
    return this.hostsService.getHosts(user.tags);
  }
}
