import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Link } from "./link.entity";

@Injectable()
export class LinkService {
  constructor(@InjectRepository(Link) private linkRepo: EntityRepository<Link>) {}

  async getLink(id: string, request: FastifyRequest) {
    const link = await this.linkRepo.findOneOrFail(id);
    if (link.hostname && !link.canSendTo(request)) {
      throw new NotFoundException("Your link is in another castle.");
    }

    return link;
  }

  async createLink(destination: string, ownerId: string) {
    const link = this.linkRepo.create({
      destination: destination,
      owner: ownerId,
    });

    await this.linkRepo.persistAndFlush(link);
    return link;
  }

  async deleteLink(id: string, ownerId: string | undefined) {
    const link = await this.linkRepo.findOneOrFail(id);
    if (ownerId && link.owner.id !== ownerId) {
      throw new UnauthorizedException("You cannot delete other users files.");
    }

    await this.linkRepo.removeAndFlush(link);
  }

  public getLinkUrls(link: Pick<Link, "id">) {
    const direct = `/s/${link.id}`;
    const metadata = `/api/link/${link.id}`;
    return { direct, metadata };
  }
}
