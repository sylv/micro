import { Controller, Get, UseGuards } from "@nestjs/common";
import { JWTAuthGuard } from "../../guards/jwt.guard";
import { UserId } from "../auth/auth.decorators";
import { UserService } from "../user/user.service";
import { HostsService } from "./hosts.service";

@Controller("api/hosts")
export class HostsController {
  constructor(private userService: UserService, private hostService: HostsService) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  async get(@UserId() userId: string) {
    const user = await this.userService.get(userId);
    const hosts = this.hostService.get(user.tags);
    return hosts;
  }
}
