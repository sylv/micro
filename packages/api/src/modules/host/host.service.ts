import { BadRequestException, ForbiddenException } from "@nestjs/common";
import normalizeUrl from "normalize-url";
import { hosts, rootHost, type MicroHost } from "../../config.js";
import { randomItem } from "../../helpers/random-item.helper.js";
import type { UserEntity } from "../user/user.entity.js";

export class HostService {
  formatHostUrl(url: string, username: string, path?: string | null) {
    const formatted = url.replace("{{username}}", username);
    if (path) return formatted + path;
    return formatted;
  }

  /**
   * Resolve a host from a URL or hostname. Handles mapping wildcards.
   * @param url The URL or hostname to resolve.
   * @param tags A list of tags the user has. If the host requires a tag that is not in this list, it will not be matched.
   * @throws if the host could not be resolved.
   */
  getHostFrom(url: string | undefined, tags: string[] | null): MicroHost {
    if (!url) return rootHost;
    const normalised = HostService.normaliseHostUrl(url);
    for (const host of hosts) {
      if (!host.pattern.test(normalised)) continue;
      if (tags && host.tags) {
        const hasTags = host.tags.every((tag) => tags.includes(tag));
        if (!hasTags) {
          throw new ForbiddenException("Missing host authorisation.");
        }
      }

      return host;
    }

    throw new BadRequestException(`Invalid host URL "${url}".`);
  }

  checkUserCanUploadTo(host: MicroHost, user: UserEntity) {
    if (host.tags && !host.tags.every((tag) => user.tags.includes(tag))) {
      throw new ForbiddenException("You are not allowed to upload to that host.");
    }

    return true;
  }

  /**
   * Resolve the x-micro-host header for content creation.
   * Validates the user can upload to the host, and if so returns the host.
   */
  resolveUploadHost(input: string, user: UserEntity) {
    const possibleHosts = input.split(/, ?/gu);
    const hostUrl = randomItem(possibleHosts);
    const host = this.getHostFrom(hostUrl, user.tags);
    this.checkUserCanUploadTo(host, user);
    return host;
  }

  static normaliseHostUrl(url: string) {
    return normalizeUrl(url, { stripProtocol: true, stripWWW: true }).toLowerCase();
  }
}
