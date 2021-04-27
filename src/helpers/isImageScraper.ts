export interface ScraperDefinition {
  name: string;
  userAgents: Array<string | RegExp>;
  types?: string[];
}

export const scrapers: ScraperDefinition[] = [
  {
    name: "Discord",
    userAgents: [
      "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)", // discord web crawler
      "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discord.com)", // discord web crawler (not currently in use but may be in the future)
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0", // discord proxy
    ],
    types: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/webm",
      "audio/wav",
      "audio/mpeg",
      "audio/ogg",
      // for some reason discord will only embed mp4s if the url contains a ".mp4" extension
      // i honestly have no clue why, the only fix that would work is using direct urls *only* for
      // mp4 uploads *only* for discord which isn't something i want to do.
      // "video/mp4"
    ],
  },
  {
    name: "curl",
    userAgents: [/^curl\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/],
  },
  {
    name: "Wget",
    userAgents: [/^Wget\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}(?: \(.*?\))?$/],
  },
  {
    name: "Camo (GitHub)",
    userAgents: [/^Camo Asset Proxy [A-z0-9._]{5,}$/],
    // https://github.com/atmos/camo/blob/e59df56a01c023850962fac16905269d264fba50/mime-types.json
    types: [
      "image/bmp",
      "image/cgm",
      "image/g3fax",
      "image/gif",
      "image/ief",
      "image/jp2",
      "image/jpeg",
      "image/jpg",
      "image/pict",
      "image/png",
      "image/prs.btif",
      "image/svg+xml",
      "image/tiff",
      "image/vnd.adobe.photoshop",
      "image/vnd.djvu",
      "image/vnd.dwg",
      "image/vnd.dxf",
      "image/vnd.fastbidsheet",
      "image/vnd.fpx",
      "image/vnd.fst",
      "image/vnd.fujixerox.edmics-mmr",
      "image/vnd.fujixerox.edmics-rlc",
      "image/vnd.microsoft.icon",
      "image/vnd.ms-modi",
      "image/vnd.net-fpx",
      "image/vnd.wap.wbmp",
      "image/vnd.xiff",
      "image/webp",
      "image/x-cmu-raster",
      "image/x-cmx",
      "image/x-icon",
      "image/x-macpaint",
      "image/x-pcx",
      "image/x-pict",
      "image/x-portable-anymap",
      "image/x-portable-bitmap",
      "image/x-portable-graymap",
      "image/x-portable-pixmap",
      "image/x-quicktime",
      "image/x-rgb",
      "image/x-xbitmap",
      "image/x-xpixmap",
      "image/x-xwindowdump",
    ],
  },
];

/**
 * Check whether the given user-agent is for a service that wants direct downloads.
 */
export function isImageScraper(requestUA?: string): ScraperDefinition | undefined {
  if (!requestUA) return;
  for (const scraper of scrapers) {
    for (const scraperUA of scraper.userAgents) {
      const match = typeof scraperUA === "string" ? scraperUA === requestUA : scraperUA.exec(requestUA);
      if (match) return scraper;
    }
  }
}
