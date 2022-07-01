import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { client } from '../apollo';
import { Header } from '../components/header/header';
import { Title } from '../components/title';
import { ToastWrapper } from '../components/toast/toast-wrapper';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Title>Home</Title>
      <Head>
        <meta property="og:site_name" content="micro" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <ToastWrapper>
        <Header />
        <div className="py-4 md:py-16">
          <Component {...pageProps} />
        </div>
      </ToastWrapper>
    </ApolloProvider>
  );
}
