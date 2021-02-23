import Head from "next/head";

export function Title({ children }: { children: React.ReactNode }) {
  return (
    <Head>
      <title>{children} &mdash; micro</title>
    </Head>
  );
}
