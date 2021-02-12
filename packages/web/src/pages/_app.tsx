import { CssBaseline, GeistProvider } from "@geist-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { SWRConfig } from "swr";
import { Menu } from "../components/Menu";
import { Title } from "../components/Title";
import { GEIST_THEME } from "../constants";
import { fetcher } from "../helpers/fetcher";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <GeistProvider theme={GEIST_THEME}>
        <CssBaseline />
        <Title>Home</Title>
        <Head>
          <meta property="og:site_name" content="micro" />
        </Head>
        <Menu />
        <Component {...pageProps} />
      </GeistProvider>
    </SWRConfig>
  );
}
