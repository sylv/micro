import type { FC, ReactNode } from 'react';
import { Fragment } from 'react';
import type { Embeddable } from './embeddable';
import { Helmet } from 'react-helmet-async';

export const EmbedContainer: FC<{ data: Embeddable; children: ReactNode }> = ({ data, children }) => {
  return (
    <Fragment>
      <Helmet>
        <meta name="twitter:title" content={data.displayName} />
        <meta property="og:title" content={data.displayName} key="title" />
        <meta property="og:url" content={data.paths.view} />
        <meta property="og:type" content="article" />
      </Helmet>
      {children}
    </Fragment>
  );
};
