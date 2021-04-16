import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import normalizeUrl from "normalize-url";
import randomItem from "random-item";
import { MicroHost } from "../../classes/MicroHost";
import { config } from "../../config";

export class HostsService {
  static normalize(url: string) {
    return normalizeUrl(url, { stripProtocol: true, stripWWW: true }).toLowerCase();
  }

  async resolve(raw: string | undefined, tags: string[] | undefined): Promise<MicroHost> {
    if (!raw) return config.hosts[0];
    const domain = randomItem(raw.split(/, ?/g));
    const normalised = HostsService.normalize(domain);
    const hosts = this.get(tags);
    for (const host of hosts) {
      if (!host.data.pattern.test(normalised)) continue;
      return host.data;
    }

    throw new BadRequestException(`Invalid host URL.`);
  }

  get(tags: string[] | undefined): Array<{ authorised: boolean; root: boolean; data: MicroHost }> {
    const parsed = [];
    for (let i = 0; i < config.hosts.length; i++) {
      const data = config.hosts[i];
      const root = i === 0;
      const authorised = data.tags.every((tag) => tags?.includes(tag));
      parsed.push({ root, authorised, data });
    }

    return parsed;
  }

  format(url: string, username: string, path?: string | null) {
    const formatted = url.replace("{{username}}", username);
    if (path) return formatted + path;
    return formatted;
  }
}
