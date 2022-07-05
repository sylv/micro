import type { NextRequest } from 'next/server';

// /i = image
// /v = video
const REDIRECT_URL_REGEX = /\/(i|v)\/(?<id>[\dA-z]+)($|\?|#)/iu;
const REDIRECT_CONTENT_UAS = [
  'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)', // Discord
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:92.0) Gecko/20100101 Firefox/92.0', // Discord
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0', // Discord
  'wget/',
  'curl/',
];

export function isAcceptableToRedirect(acceptHeader: string | null) {
  if (!acceptHeader) return false;
  if (acceptHeader.includes('image/*')) return true;
  if (acceptHeader.includes('video/*')) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  // match /i and /v urls and redirect them to the content url
  // this is how pasting an embedded image link in discord still embeds the image
  // /i and /v routes are necessary so we dont have to lookup the type of the file, because we still
  // want to return html for other files so we can give opengraph tags about the files that discord wont embed directly.
  const redirectUrlMatch = REDIRECT_URL_REGEX.exec(req.url);
  if (redirectUrlMatch) {
    const fileId = redirectUrlMatch.groups!.id;
    const accept = req.headers.get('accept');
    const userAgent = req.headers.get('user-agent');
    const isScrapingUA = userAgent && REDIRECT_CONTENT_UAS.some((ua) => userAgent.startsWith(ua));
    if (isAcceptableToRedirect(accept) || isScrapingUA) {
      return new Response(null, {
        status: 302,
        headers: {
          location: `/api/file/${fileId}`,
          'x-beep': 'boop',
        },
      });
    }
  }
}
