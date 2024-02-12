import { createClient, fetchExchange, ssrExchange } from '@urql/preact';
import { Provider as UrqlProvider } from '@urql/preact';
import { hydrate } from 'preact';
import { HelmetProvider } from 'react-helmet-async';
import type { OnRenderClientAsync } from 'vike/types';
import { App } from '../app';
import { PageContextProvider } from './usePageContext';
import { cacheOptions } from './cache';
import { cacheExchange } from '@urql/exchange-graphcache';

export const onRenderClient: OnRenderClientAsync = async (pageContext) => {
  const { Page } = pageContext;
  const ssr = ssrExchange({ isClient: true });
  const exchanges = [ssr, cacheExchange(cacheOptions), fetchExchange];

  if (import.meta.env.MODE === 'development') {
    const { devtoolsExchange } = await import('@urql/devtools');
    exchanges.unshift(devtoolsExchange);
  }

  const client = createClient({
    url: '/api/graphql',
    exchanges: exchanges,
  });

  if (pageContext.state) {
    ssr.restoreData(pageContext.state);
  }

  hydrate(
    <PageContextProvider pageContext={pageContext}>
      <UrqlProvider value={client}>
        <HelmetProvider>
          <App>
            <Page routeParams={pageContext.routeParams || {}} />
          </App>
        </HelmetProvider>
      </UrqlProvider>
    </PageContextProvider>,
    document.querySelector('#root')!,
  );
};
