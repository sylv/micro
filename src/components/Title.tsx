import Head from "next/head";

export function Title({ children }: { children: string | number }) {
  return (
    <Head>
      <title>{children} &mdash; micro</title>
      <meta property="og:title" content={children.toString()} key="title" />
    </Head>
  );
}
