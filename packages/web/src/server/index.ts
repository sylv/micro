import FastifyStatic from "@fastify/static";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import FastifyProxy from "@fastify/http-proxy";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import type { IncomingMessage, ServerResponse } from "http";
import { compile, match } from "path-to-regexp";
import url from "url";
import { ssrExchange } from "urql";
import { renderPage } from "vike/server";
import type { PageContext } from "vike/types";
import { REWRITES } from "./rewrites";

const rewrites = REWRITES.map(({ source, destination }) => ({
  match: match(source),
  toPath: compile(destination),
}));

const redirectUrlRegex = /\/(i|v)\/(?<id>[\dA-z]+)($|\?|#)/iu;
const redirectUserAgents = [
  "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)", // Discord
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:92.0) Gecko/20100101 Firefox/92.0", // Discord
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0", // Discord
  "wget/",
  "curl/",
];

export function shouldRedirectBasedOnAccept(acceptHeader: string | null) {
  if (!acceptHeader) return false;
  if (acceptHeader.includes("image/*")) return true;
  if (acceptHeader.includes("video/*")) return true;
  return false;
}

async function startServer() {
  const instance = Fastify({
    rewriteUrl: (request) => {
      if (!request.url) throw new Error("No url");
      const { pathname } = url.parse(request.url);
      if (!pathname) return request.url;

      // if discord tries to request the html of an image, redirect it straight to the image
      // this means the image is embedded, not the opengraph data for the image.
      // also supports some other user agents that do the same thing
      const isPathToRedirect = redirectUrlRegex.exec(pathname);
      if (isPathToRedirect) {
        const userAgent = request.headers["user-agent"];
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

  if (import.meta.env.PROD) {
    instance.register(FastifyStatic, {
      root: join(dirname(fileURLToPath(import.meta.url)), "client"),
      wildcard: false,
    });
  }

  instance.register(FastifyProxy, {
    prefix: "/api",
    upstream: process.env.BACKEND_API_URL || "http://localhost:8080",
    replyOptions: {
      rewriteRequestHeaders: (originalReq, headers) => ({
        ...headers,
        "x-forwarded-for": [originalReq.headers["x-forwarded-for"], originalReq.raw.socket.remoteAddress]
          .filter(Boolean).join(", "),
        "x-forwarded-host": originalReq.headers.host,
      }),
    },
  });

  instance.get("*", async (request, reply) => {
    let forwardedFor: string | undefined;
    if (request.headers["x-forwarded-for"] && typeof request.headers["x-forwarded-for"] === "string") {
      forwardedFor = request.headers["x-forwarded-for"];
    } else if (request.headers.host) {
      forwardedFor = request.headers.host;
    }

    const pageContextInit = {
      urlOriginal: request.url,
      ssrExchange: ssrExchange({ isClient: false }),
      headersOriginal: {
        ...request.headers,
        ["x-forwarded-host"]: forwardedFor,
      },
    } satisfies Partial<PageContext>;

    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (httpResponse) {
      const { pipe, statusCode, headers, earlyHints } = httpResponse;
      if (earlyHints.length) reply.raw.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
      for (const [name, value] of headers) reply.header(name, value);
      reply.status(statusCode);
      return pipe(reply.raw);
    } else {
      reply.status(500).send("Internal Server Error");
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

  fastify!.server.emit("request", request, reply);
}

if (import.meta.env.PROD) {
  await fastifyHandlerPromise;
  await fastify!.listen({ host: process.env.HOST || "0.0.0.0", port: Number(process.env.PORT || 3000) });
}

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(async () => { await fastify?.close(); });
}
