import { CssBaseline, GeistProvider } from "@geist-ui/react";
import { AppProps } from "next/app";
import React from "react";
import { Menu } from "../components/Menu";
import { Title } from "../components/Title";
import { GEIST_THEME } from "../constants";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GeistProvider theme={GEIST_THEME}>
      <CssBaseline />
      <Title>Home</Title>
      <Menu />
      <Component {...pageProps} />
    </GeistProvider>
  );
}
