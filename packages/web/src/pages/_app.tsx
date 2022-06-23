import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { SWRConfig } from "swr";
import { Header } from "../components/header/header";
import { Title } from "../components/title";
import { fetcher } from "../helpers/fetcher.helper";
import { ToastWrapper } from "../components/toast/toast-wrapper";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <Title>Home</Title>
      <Head>
        <meta property="og:site_name" content="micro" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <ToastWrapper>
        <Header />
        <Component {...pageProps} />
      </ToastWrapper>
    </SWRConfig>
  );
}
