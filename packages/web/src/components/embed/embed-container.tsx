import classNames from 'classnames';
import Head from 'next/head';
import type { FC, ReactNode } from 'react';
import type { Embeddable } from './embeddable';

export const EmbedContainer: FC<{ data: Embeddable; children: ReactNode; centre?: boolean; className?: string }> = ({
  data,
  children,
  className,
  centre = true,
}) => {
  const classes = classNames(
    'flex items-center col-span-5 rounded shadow-2xl bg-dark-200 max-h-[75vh] min-h-[15em]',
    centre && 'justify-center',
    className
  );

  return (
    <div className={classes}>
      <Head>
        <meta name="twitter:title" content={data.displayName} />
        <meta property="og:title" content={data.displayName} key="title" />
        <meta property="og:url" content={data.paths.view} />
        <meta property="og:type" content="article" />
      </Head>
      {children}
    </div>
  );
};
