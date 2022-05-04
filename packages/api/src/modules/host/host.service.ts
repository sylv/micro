import { BadRequestException, ForbiddenException } from "@nestjs/common";
import normalizeUrl from "normalize-url";
import { MicroHost } from "../../classes/MicroHost";
import { config } from "../../config";
import { randomItem } from "../../helpers/random-item.helper";

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
  async getHostFrom(url: string | undefined, tags: string[] | null): Promise<MicroHost> {
    console.log({ url });
    if (!url) return config.rootHost;
    const normalised = HostService.normaliseHostUrl(url);
    for (const host of config.hosts) {
      if (!host.pattern.test(normalised)) continue;
      if (tags) {
        const hasTags = host.tags.every((tag) => tags.includes(tag));
        if (!hasTags) {
          throw new ForbiddenException("Missing host authorisation.");
        }
      }

      return host;
    }

    throw new BadRequestException(`Invalid host URL "${url}".`);
  }

  canHostSendFile(host: MicroHost, file: { host?: string }) {
    // todo: if host.wildcard, we should check to make sure the file owner
    // matches the given username in the request url. so uploads to
    // sylver.is-fucking.gay can't be accessed on cyk.is-fucking.gay and vice versa
    if (!config.restrictFilesToHost) return true;
    // files without a host can be served on all hosts
    if (!file.host) return true;
    // the host that the file was uploaded to can serve the file
    if (file.host === host.normalised) return true;
    // root host can serve all files.
    if (host.normalised === config.rootHost.normalised) return true;
    return false;
  }

  static normaliseHostUrl(url: string) {
    return normalizeUrl(url, { stripProtocol: true, stripWWW: true }).toLowerCase();
  }
}
