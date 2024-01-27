import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { hydrateRoot } from 'react-dom/client';
import { OnRenderClientAsync } from 'vike/types';
import { App } from '../app';
import { typePolicies } from './policy';
import { PageContextProvider } from './usePageContext';
import { HelmetProvider } from 'react-helmet-async';

export const onRenderClient: OnRenderClientAsync = async (pageContext) => {
  const { Page } = pageContext;
  const client = new ApolloClient({
    link: new HttpLink({ uri: '/api/graphql' }),
    cache: new InMemoryCache({ typePolicies }),
  });

  if (pageContext.state) {
    client.cache.restore(pageContext.state);
  }

  hydrateRoot(
    document.getElementById('root')!,
    <PageContextProvider pageContext={pageContext}>
      <ApolloProvider client={client}>
        <HelmetProvider>
          <App>
            <Page routeParams={pageContext.routeParams || {}} />
          </App>
        </HelmetProvider>
      </ApolloProvider>
    </PageContextProvider>,
  );
};
