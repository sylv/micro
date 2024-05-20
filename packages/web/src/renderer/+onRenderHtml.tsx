import { cacheExchange } from "@urql/exchange-graphcache";
import { Provider as UrqlProvider, createClient, fetchExchange, ssrExchange } from "@urql/preact";
import type { HelmetServerState } from "react-helmet-async";
import { HelmetProvider } from "react-helmet-async";
import { dangerouslySkipEscape, escapeInject } from "vike/server";
import type { OnRenderHtmlAsync } from "vike/types";
import { App } from "../app";
import { cacheOptions } from "./cache";
import { renderToStringWithData } from "./prepass";
import type { PageProps } from "./types";
import { PageContextProvider } from "./usePageContext";

const GRAPHQL_URL =
  (import.meta.env.PUBLIC_ENV__FRONTEND_API_URL || import.meta.env.FRONTEND_API_URL) + "/graphql";

export const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { Page } = pageContext;
  const pageProps: PageProps = { routeParams: pageContext.routeParams };

  const headers: Record<string, string> = {};
  if (pageContext.cookies) headers.Cookie = pageContext.cookies;
  if (pageContext.forwardedHost) headers["x-forwarded-host"] = pageContext.forwardedHost;

  const ssr = ssrExchange({ isClient: false });
  const client = createClient({
    url: GRAPHQL_URL,
    exchanges: [ssr, cacheExchange(cacheOptions), fetchExchange],
    fetchOptions: {
      credentials: "same-origin",
      headers: headers,
    },
  });

  const helmetContext: { helmet?: HelmetServerState } = {};
  const tree = (
    <PageContextProvider pageContext={pageContext}>
      <UrqlProvider value={client}>
        <HelmetProvider context={helmetContext}>
          <App>
            <Page {...pageProps} />
          </App>
        </HelmetProvider>
      </UrqlProvider>
    </PageContextProvider>
  );

  const pageHtml = await renderToStringWithData(client, tree);
  const helmet = helmetContext.helmet!;
  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${dangerouslySkipEscape(helmet.title.toString())}
        ${dangerouslySkipEscape(helmet.priority.toString())}
        ${dangerouslySkipEscape(helmet.meta.toString())}
        ${dangerouslySkipEscape(helmet.link.toString())}
        ${dangerouslySkipEscape(helmet.script.toString())}
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml: documentHtml,
    pageContext: {
      state: ssr.extractData(),
    },
  };
};
