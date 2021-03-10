import { CssBaseline, GeistProvider } from "@geist-ui/react";
import { GetStaticProps } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { SWRConfig } from "swr";
import { Menu } from "../components/Menu";
import { Title } from "../components/Title";
import { fetcher } from "../helpers/fetcher";
import { GEIST_THEME } from "../helpers/theme";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <GeistProvider themes={[GEIST_THEME]} themeType={GEIST_THEME.type}>
        <CssBaseline />
        <Title>Home</Title>
        <Head>
          <meta property="og:site_name" content="micro" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </Head>
        <Menu />
        <Component {...pageProps} />
      </GeistProvider>
    </SWRConfig>
  );
}
