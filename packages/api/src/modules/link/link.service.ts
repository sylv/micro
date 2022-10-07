import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import type { MicroHost } from '../../classes/MicroHost.js';
import { Link } from './link.entity.js';

@Injectable()
export class LinkService {
  constructor(@InjectRepository(Link) private readonly linkRepo: EntityRepository<Link>) {}

  async getLink(id: string, request: FastifyRequest) {
    const link = await this.linkRepo.findOneOrFail(id, { populate: ['owner'] });
    if (!link.canSendTo(request)) {
      throw new NotFoundException('Your link is in another castle.');
    }

    return link;
  }

  async createLink(destination: string, ownerId: string, host?: MicroHost) {
    const link = this.linkRepo.create({
      destination: destination,
      owner: ownerId,
      hostname: host?.normalised,
    });

    await this.linkRepo.persistAndFlush(link);
    return link;
  }

  async deleteLink(id: string, ownerId: string | undefined) {
    const link = await this.linkRepo.findOneOrFail(id);
    if (ownerId && link.owner.id !== ownerId) {
      throw new UnauthorizedException('You cannot delete other users files.');
    }

    await this.linkRepo.removeAndFlush(link);
  }

  getLinkUrls(link: Pick<Link, 'id'>) {
    const direct = `/s/${link.id}`;
    const metadata = `/api/link/${link.id}`;
    return { direct, metadata };
  }
}
