import { BadRequestException, ForbiddenException } from '@nestjs/common';
import normalizeUrl from 'normalize-url';
import type { MicroHost } from '../../classes/MicroHost';
import { config } from '../../config';
import type { User } from '../user/user.entity';

export class HostService {
  formatHostUrl(url: string, username: string, path?: string | null) {
    const formatted = url.replace('{{username}}', username);
    if (path) return formatted + path;
    return formatted;
  }

  /**
   * Resolve a host from a URL or hostname. Handles mapping wildcards.
   * @param url The URL or hostname to resolve.
   * @param tags A list of tags the user has. If the host requires a tag that is not in this list, it will not be matched.
   * @throws if the host could not be resolved.
   */
  async getHostFrom(url: string | undefined, tags: string[] | null): Promise<MicroHost> {
    if (!url) return config.rootHost;
    const normalised = HostService.normaliseHostUrl(url);
    for (const host of config.hosts) {
      if (!host.pattern.test(normalised)) continue;
      if (tags && host.tags) {
        const hasTags = host.tags.every((tag) => tags.includes(tag));
        if (!hasTags) {
          throw new ForbiddenException('Missing host authorisation.');
        }
      }

      return host;
    }

    throw new BadRequestException(`Invalid host URL "${url}".`);
  }

  checkUserCanUploadTo(host: MicroHost, user: User) {
    if (host.tags && !host.tags.every((tag) => user.tags.includes(tag))) {
      throw new ForbiddenException('You are not allowed to upload to that host.');
    }

    return true;
  }

  static normaliseHostUrl(url: string) {
    return normalizeUrl(url, { stripProtocol: true, stripWWW: true }).toLowerCase();
  }
}
