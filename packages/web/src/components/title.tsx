import Head from 'next/head';
import type { FC } from 'react';

export const Title: FC<{ children: string | string[] }> = ({ children }) => {
  const title = Array.isArray(children) ? children.join(' ') : children;
  return (
    <Head>
      <title>{`${title} — micro`}</title>
      <meta property="og:title" content={title} key="title" />
    </Head>
  );
};
