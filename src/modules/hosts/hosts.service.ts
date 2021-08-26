import { BadRequestException, ForbiddenException } from "@nestjs/common";
import normalizeUrl from "normalize-url";
import { MicroHost } from "../../classes/MicroHost";
import { config } from "../../config";
import { randomItem } from "../../helpers/random-item.helper";

export class HostsService {
  formatHostUrl(url: string, username: string, path?: string | null) {
    const formatted = url.replace("{{username}}", username);
    if (path) return formatted + path;
    return formatted;
  }

  async resolveHost(raw: string | undefined, tags: string[] | undefined, requireAuth: boolean): Promise<MicroHost> {
    if (!raw) return config.rootHost;
    const domain = randomItem(raw.split(/, ?/g));
    const normalised = HostsService.normaliseHostUrl(domain);
    const hosts = this.getHosts(tags);
    for (const host of hosts) {
      if (!host.data.pattern.test(normalised)) continue;
      if (requireAuth && !host.authorised) {
        throw new ForbiddenException("Missing host authorisation.");
      }

      return host.data;
    }

    throw new BadRequestException(`Invalid host URL "${raw}".`);
  }

  getHosts(tags: string[] | undefined): Array<{ authorised: boolean; root: boolean; data: MicroHost }> {
    const parsed = [];
    for (let index = 0; index < config.hosts.length; index++) {
      const data = config.hosts[index];
      const root = index === 0;
      const authorised = data.tags.every((tag) => tags?.includes(tag));
      parsed.push({ root, authorised, data });
    }

    return parsed;
  }

  checkHostCanSendFile(file: { host: string | null }, host: MicroHost) {
    // todo: if host.wildcard, we should check to make sure the file owner
    // matches the given username in the request url. so uploads to
    // sylver.is-fucking.gay can't be accessed on cyk.is-fucking.gay and vice versa
    if (!config.restrictFilesToHost) return true;
    // files without a host can be accessed anywhere
    if (!file.host) return true;
    // file upload host can serve the file
    if (file.host === host.key) return true;
    // root host can serve all files.
    if (host.key === config.rootHost.key) return true;
    return false;
  }

  static normaliseHostUrl(url: string) {
    return normalizeUrl(url, { stripProtocol: true, stripWWW: true }).toLowerCase();
  }
}
