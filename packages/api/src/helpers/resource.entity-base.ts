import type { Ref } from '@mikro-orm/core';
import { BeforeCreate, Entity, Property, type EventArgs } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import type { FastifyRequest } from 'fastify';
import { config, hosts, rootHost } from '../config.js';
import type { User } from '../modules/user/user.entity.js';
import type { ResourceLocations } from '../types/resource-locations.type.js';
import { getHostFromRequest } from './get-host-from-request.js';

@Entity({ abstract: true })
@ObjectType({ isAbstract: true })
export abstract class Resource {
  @Property({ nullable: true })
  hostname?: string;

  abstract owner?: Ref<User>;
  abstract getPaths(): ResourceLocations;

  getUrls() {
    const baseUrl = this.getBaseUrl();
    const formatted: Record<string, string> = {};
    const paths = this.getPaths();
    for (const key of Object.keys(paths)) {
      const path = (paths as any)[key];
      if (!path) continue;
      formatted[key] = baseUrl + path;
    }

    return formatted as any as ResourceLocations;
  }

  getHost() {
    if (!this.hostname) return rootHost;
    const match = hosts.find((host) => host.normalised === this.hostname || host.pattern.test(this.hostname!));
    if (match) return match;
    return rootHost;
  }

  getBaseUrl() {
    const owner = this.owner?.getEntity();
    const host = this.getHost();
    const hasPlaceholder = host.url.includes('{{username}}');
    if (hasPlaceholder) {
      if (!owner) return rootHost.url;
      return host.url.replace('{{username}}', owner.username);
    }

    return host.url;
  }

  canSendTo(request: FastifyRequest) {
    if (!this.hostname) {
      return true;
    }

    const hostname = getHostFromRequest(request);
    if (!config.restrictFilesToHost) return true;

    // root host can send all files
    if (hostname === rootHost.normalised) return true;
    if (this.hostname === hostname) return true;
    if (this.hostname?.includes('{{username}}')) {
      // old files have {{username}} in the persisted hostname, migrating them
      // to the new format is too difficult so this does a dirty comparison
      // that should work for most use cases.
      const withoutWildcard = this.hostname.replace('{{username}}', '');
      return hostname.endsWith(withoutWildcard);
    }

    return false;
  }

  @BeforeCreate()
  async onBeforePersist(args: EventArgs<Resource>) {
    if (args.entity.hostname?.includes('{{username}}')) {
      throw new Error('Host placeholders should be replaced before insert');
    }
  }
}
