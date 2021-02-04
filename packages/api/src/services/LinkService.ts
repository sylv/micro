import { Injectable } from "@nestjs/common";
import { getRepository } from "typeorm";
import { Link } from "../entities/Link";

@Injectable()
export class LinkService {
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
}
