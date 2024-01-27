import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';

export const Title: FC<{ children: string | string[] }> = ({ children }) => {
  const title = Array.isArray(children) ? children.join(' ') : children;
  return (
    <Helmet>
      <title>{`${title} — micro`}</title>
      <meta property="og:title" content={title} key="title" />
    </Helmet>
  );
};
