import { Link } from "@prisma/client";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { shortId } from "../../helpers/shortId";
import { prisma } from "../../prisma";

@Injectable()
export class LinkService {
  async get(id: string) {
    const link = await prisma.link.findFirst({ where: { id } });
    if (!link) throw new NotFoundException();
    return link;
  }

  async create(destination: string, ownerId: string) {
    const link = prisma.link.create({
      data: {
        id: shortId(),
        destination: destination,
        ownerId: ownerId,
      },
    });

    return link;
  }

  async delete(id: string, ownerId: string | undefined) {
    const link = await this.get(id);
    if (!link) throw new NotFoundException();
    if (ownerId && link.ownerId !== ownerId) {
      throw new UnauthorizedException("You cannot delete other users files.");
    }

    await prisma.link.delete({ where: { id: link.id } });
  }

  public getUrls(link: Pick<Link, "id">) {
    const direct = `/s/${link.id}`;
    const metadata = `/api/link/${link.id}`;
    return { direct, metadata };
  }
}
