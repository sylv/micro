import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { SWRConfig } from "swr";
import { Menu } from "../components/Menu";
import { Title } from "../components/Title";
import { fetcher } from "../helpers/fetcher";
import { ToastWrapper } from "../components/Toast";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <Title>Home</Title>
      <Head>
        <meta property="og:site_name" content="micro" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <Menu />
      <ToastWrapper>
        <Component {...pageProps} />
      </ToastWrapper>
    </SWRConfig>
  );
}
