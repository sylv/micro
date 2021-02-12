const userAgents: string[] = [
  "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)", // discord web crawler
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0", // discord proxy
];

export function isImageScraper(userAgent?: string) {
  if (!userAgent) return false;
  return userAgents.includes(userAgent);
}
