import { GetFileData } from "@ryanke/micro-api";
import type { NextFetchEvent, NextRequest } from "next/server";
import { fetcher } from "../helpers/fetcher.helper";

const FILE_ID_REGEX = /\/(f|file)\/(?<id>[A-z0-9]+)($|\?|#)/i;
const REDIRECT_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp", "video/mp4", "video/webm"]);
const SCRAPING_UAS = new Set([
  "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)", // Discord
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:92.0) Gecko/20100101 Firefox/92.0", // Discord follow-up
]);

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // for file routes, try detect image scrapers and send them the full image
  // even if the url is embedded. this is what allows our images to be embedded
  // in discord. its also absolutely disgusting.
  const fileIdMatch = req.url.match(FILE_ID_REGEX);
  if (fileIdMatch) {
    const fileId = fileIdMatch.groups!.id;
    const accept = req.headers.get("accept");
    const userAgent = req.headers.get("user-agent");
    if ((accept && accept.includes("image/*")) || (userAgent && SCRAPING_UAS.has(userAgent))) {
      try {
        // redirect scraping user agents to the files direct url
        // todo: discord scrapes the url twice, once as discord and once with a generic
        // user-agent when it doesnt find opengraph data. this means we're fetching the file twice
        // every time someone sends a link in discord.
        const file = await fetcher<GetFileData>(`file/${fileId}`);
        if (REDIRECT_TYPES.has(file.type)) {
          return new Response(null, {
            status: 302,
            headers: {
              location: `/api/file/${file.id}/content`,
            },
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
