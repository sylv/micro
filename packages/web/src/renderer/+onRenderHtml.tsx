import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import { App } from '../app';
import { typePolicies } from './policy';
import { PageProps } from './types';
import { PageContextProvider } from './usePageContext';

const GRAPHQL_URL = (import.meta.env.PUBLIC_ENV__FRONTEND_API_URL || import.meta.env.FRONTEND_API_URL) + '/graphql';

export const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { Page } = pageContext;
  const pageProps: PageProps = { routeParams: pageContext.routeParams };

  const headers = pageContext.cookies ? { Cookie: pageContext.cookies } : undefined;
  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache({ typePolicies }),
    link: new HttpLink({
      uri: GRAPHQL_URL,
      credentials: 'same-origin',
      headers: headers,
    }),
  });

  const helmetContext: { helmet?: HelmetServerState } = {};
  const tree = (
    <PageContextProvider pageContext={pageContext}>
      <ApolloProvider client={client}>
        <HelmetProvider context={helmetContext}>
          <App>
            <Page {...pageProps} />
          </App>
        </HelmetProvider>
      </ApolloProvider>
    </PageContextProvider>
  );

  const pageHtml = await renderToStringWithData(tree);
  const helmet = helmetContext.helmet!;
  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <Helmet>
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
      state: client.cache.extract(),
    },
  };
};
