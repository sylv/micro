import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { getRepository } from "typeorm";
import { Link } from "../entities/Link";

@Injectable()
export class LinkService {
  async getLink(id: string) {
    const linkRepo = getRepository(Link);
    const link = await linkRepo.findOne(id);
    return link;
  }

  async createLink(destination: string, ownerId: string) {
    const linkRepo = getRepository(Link);
    const link = linkRepo.create({
      destination: destination,
      owner: {
        id: ownerId,
      },
    });

    await linkRepo.save(link);
    return link;
  }

  async deleteLink(id: string, ownerId: string | undefined) {
    const linkRepo = getRepository(Link);
    const link = await linkRepo.findOne(id);
    if (!link) throw new NotFoundException();
    if (ownerId && link.ownerId !== ownerId) {
      throw new UnauthorizedException("You cannot delete other users files.");
    }

    await linkRepo.remove(link);
  }
}
