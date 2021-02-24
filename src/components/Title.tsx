import Head from "next/head";

export function Title({ children }: { children: string }) {
  return (
    <Head>
      <title>{children} &mdash; micro</title>
      <meta property="og:title" content={children} key="title" />
    </Head>
  );
}
