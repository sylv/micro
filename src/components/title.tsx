import Head from "next/head";
import { FunctionComponent } from "react";

export const Title: FunctionComponent = (props) => {
  const children = Array.isArray(props.children) ? props.children.join("") : `${props.children}`;
  return (
    <Head>
      <title>{children} &mdash; micro</title>
      <meta property="og:title" content={children} key="title" />
    </Head>
  );
};
