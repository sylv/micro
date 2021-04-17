import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Link } from "@prisma/client";
import { MicroHost } from "../../classes/MicroHost";
import { generateContentId } from "../../helpers/generateContentId";
import { prisma } from "../../prisma";
import { HostsService } from "../hosts/hosts.service";

@Injectable()
export class LinkService {
  constructor(private hostsService: HostsService) {}

  async getLink(id: string, host: MicroHost) {
    const link = await prisma.link.findFirst({ where: { id } });
    if (!link) throw new NotFoundException();
    if (!this.hostsService.checkHostCanSendFile(link, host)) {
      throw new NotFoundException("Your redirect is in another castle.");
    }

    return link;
  }

  async createLink(destination: string, ownerId: string) {
    const link = prisma.link.create({
      data: {
        id: generateContentId(),
        destination: destination,
        ownerId: ownerId,
      },
    });

    return link;
  }

  async deleteLink(id: string, ownerId: string | undefined) {
    const link = await prisma.link.findFirst({ where: { id } });
    if (!link) throw new NotFoundException();
    if (ownerId && link.ownerId !== ownerId) {
      throw new UnauthorizedException("You cannot delete other users files.");
    }

    await prisma.link.delete({ where: { id: link.id } });
  }

  public getLinkUrls(link: Pick<Link, "id">) {
    const direct = `/s/${link.id}`;
    const metadata = `/api/link/${link.id}`;
    return { direct, metadata };
  }
}
