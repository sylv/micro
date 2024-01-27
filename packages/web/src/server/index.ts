import FastifyEarlyHints from '@fastify/early-hints';
import FastifyProxy from '@fastify/http-proxy';
import Fastify, { FastifyInstance } from 'fastify';
import { createReadStream } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import mime from 'mime';
import { dirname, resolve } from 'path';
import { compile, match } from 'path-to-regexp';
import rrdir from 'readdirp';
import { renderPage } from 'vike/server';
import { PageContext } from 'vike/types';
import { REWRITES } from './rewrites';
import { fileURLToPath } from 'url';

const fileDir = dirname(fileURLToPath(import.meta.url));
const staticDir = process.env.STATIC_DIR?.replace('{{FILE_DIR}}', fileDir) || resolve('dist/client');
const rewrites = REWRITES.map(({ source, destination }) => ({
  match: match(source),
  toPath: compile(destination),
}));

const redirectUrlRegex = /\/(i|v)\/(?<id>[\dA-z]+)($|\?|#)/iu;
const redirectUserAgents = [
  'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)', // Discord
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:92.0) Gecko/20100101 Firefox/92.0', // Discord
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0', // Discord
  'wget/',
  'curl/',
];

export function shouldRedirectBasedOnAccept(acceptHeader: string | null) {
  if (!acceptHeader) return false;
  if (acceptHeader.includes('image/*')) return true;
  if (acceptHeader.includes('video/*')) return true;
  return false;
}

async function startServer() {
  const instance = Fastify({
    rewriteUrl: (request) => {
      if (!request.url) throw new Error('No url');
      const { pathname } = new URL(request.url, 'http://localhost');

      // if discord tries to request the html of an image, redirect it straight to the image
      // this means the image is embedded, not the opengraph data for the image.
      // also supports some other user agents that do the same thing
      const isPathToRedirect = redirectUrlRegex.exec(pathname);
      if (isPathToRedirect) {
        const userAgent = request.headers['user-agent'];
        const accept = request.headers.accept;
        const isUserAgentToRedirect = redirectUserAgents.some((ua) => userAgent?.startsWith(ua));
        const isAcceptToRedirect = accept && shouldRedirectBasedOnAccept(accept);
        if (isUserAgentToRedirect || isAcceptToRedirect) {
          const fileId = isPathToRedirect.groups?.id;
          if (fileId) {
            return `/api/file/${fileId}`;
          }
        }
      }

      // redirect paths like /i/abc123 to /file/abc123
      // doing this with vike routing seems to break client side routing
      for (const { match, toPath } of rewrites) {
        const result = match(pathname);
        if (result) {
          return toPath(result.params);
        }
      }

      return request.url;
    },
  });

  instance.register(FastifyEarlyHints, {
    warn: true,
  });

  instance.register(FastifyProxy, {
    prefix: '/api',
    upstream: process.env.BACKEND_API_URL || 'http://localhost:8080',
    replyOptions: {
      rewriteRequestHeaders: (originalReq, headers) => ({
        ...headers,
        'x-forwarded-host': originalReq.headers.host,
      }),
    },
  });

  const files = new Set<string>();
  const info = new Map<string, { type: string; size: number }>();
  for await (const file of rrdir(staticDir, { type: 'files', alwaysStat: true })) {
    const mimeType = mime.getType(file.fullPath) || 'application/octet-stream';

    files.add(file.fullPath);
    info.set(file.fullPath, {
      type: mimeType,
      size: file.stats!.size,
    });
  }

  instance.get('*', async (request, reply) => {
    // check if its for a file on disk, and send that instead
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const file = resolve(staticDir, pathname.slice(1));
    if (files.has(file)) {
      const extraInfo = info.get(file);
      if (extraInfo) {
        reply.header('Content-Type', extraInfo.type);
        reply.header('Content-Length', extraInfo.size);
      }

      const stream = createReadStream(file);
      return reply.send(stream);
    }

    let cookies;
    if (request.headers.cookie && typeof request.headers.cookie === 'string') {
      cookies = request.headers.cookie;
    }

    const pageContextInit = {
      urlOriginal: request.originalUrl,
      cookies: cookies,
    } satisfies Partial<PageContext>;

    const pageContext = await renderPage(pageContextInit);
    if (pageContext.errorWhileRendering) {
      // todo: do something with the error
    }

    const { httpResponse } = pageContext;
    if (!httpResponse) {
      reply.status(500).send('Internal Server Error');
    } else {
      const { body, statusCode, headers, earlyHints } = httpResponse;
      reply.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
      headers.forEach(([name, value]) => reply.header(name, value));
      reply.status(statusCode);
      reply.send(body);
    }
  });

  await instance.ready();
  fastify = instance;
}

let fastify: FastifyInstance | undefined;
const fastifyHandlerPromise = startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});

export default async function handler(request: IncomingMessage, reply: ServerResponse) {
  if (!fastify) {
    await fastifyHandlerPromise;
  }

  fastify!.server.emit('request', request, reply);
}