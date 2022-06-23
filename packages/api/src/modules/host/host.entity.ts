/* eslint-disable sonarjs/no-duplicate-string */
import { BeforeCreate, BeforeUpdate, Entity, EventArgs, Property } from '@mikro-orm/core';
import type { FastifyRequest } from 'fastify';
import { config } from '../../config';

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

@Entity({ abstract: true })
export abstract class WithHostname {
  @Property({ nullable: true })
  hostname?: string;

  getHost() {
    if (!this.hostname) return config.rootHost;
    const match = config.hosts.find((host) => host.pattern.test(this.hostname!));
    if (match) return match;
    return config.rootHost;
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
  @BeforeUpdate()
  async onBeforePersist(args: EventArgs<WithHostname>) {
    console.log('Before persist');
    if (args.entity.hostname?.includes('{{username}}')) {
      throw new Error('Host placeholders should be replaced before insert');
    }
  }
}
