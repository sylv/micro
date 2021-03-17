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
