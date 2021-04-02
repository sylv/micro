import Head from "next/head";
import { FunctionComponent } from "react";

export const Title: FunctionComponent = (props) => {
  return (
    <Head>
      <title>{props.children} &mdash; micro</title>
      <meta property="og:title" content={`${props.children}`} key="title" />
    </Head>
  );
};
