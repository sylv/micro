/* eslint-disable sonarjs/no-duplicate-string */
import type { IdentifiedReference } from '@mikro-orm/core';
import { BeforeCreate, Entity, EventArgs, Property } from '@mikro-orm/core';
import type { FastifyRequest } from 'fastify';
import { config } from './config';
import type { User } from './modules/user/user.entity';

function getHostFromRequest(request: FastifyRequest): string {
  if (request.headers['x-forwarded-host']) {
    if (Array.isArray(request.headers['x-forwarded-host'])) {
      return request.headers['x-forwarded-host'][0];
    }

    return request.headers['x-forwarded-host'];
  }

  if (request.headers.host) return request.headers.host;
  return request.hostname;
}

export interface ResourcePaths {
  view: string;
  direct: string;
  delete?: string;
  thumbnail?: string;
}

@Entity({ abstract: true })
export abstract class ResourceBase {
  @Property({ nullable: true })
  hostname?: string;

  abstract owner?: IdentifiedReference<User>;
  abstract paths: ResourcePaths;

  @Property({ persist: false })
  get urls() {
    const baseUrl = this.getBaseUrl();
    const formatted: Record<string, string> = {};
    const paths = this.paths;
    for (const key of Object.keys(paths)) {
      formatted[key] = baseUrl + (paths as any)[key];
    }

    return formatted as any as ResourcePaths;
  }

  getHost() {
    if (!this.hostname) return config.rootHost;
    const match = config.hosts.find((host) => host.normalised === this.hostname || host.pattern.test(this.hostname!));
    if (match) return match;
    return config.rootHost;
  }

  getBaseUrl() {
    const owner = this.owner?.getEntity();
    const host = this.getHost();
    const hasPlaceholder = host.url.includes('{{username}}');
    if (hasPlaceholder) {
      if (!owner) return config.rootHost.url;
      return host.url.replace('{{username}}', owner.username);
    }

    return host.url;
  }

  canSendTo(request: FastifyRequest) {
    const hostname = getHostFromRequest(request);
    if (!config.restrictFilesToHost) return true;

    // root host can send all files
    if (hostname === config.rootHost.normalised) return true;
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
  async onBeforePersist(args: EventArgs<ResourceBase>) {
    if (args.entity.hostname?.includes('{{username}}')) {
      throw new Error('Host placeholders should be replaced before insert');
    }
  }
}
