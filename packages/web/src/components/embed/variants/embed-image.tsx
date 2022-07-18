import classNames from 'classnames';
import Head from 'next/head';
import { Fragment } from 'react';
import { BASE_EMBED_CLASSES } from '../embed';
import type { Embeddable } from '../embeddable';

export const EmbedImage = ({ data }: { data: Embeddable }) => {
  const classes = classNames('flex items-center justify-center', BASE_EMBED_CLASSES);
  return (
    <Fragment>
      <Head>
        <meta name="twitter:image" content={data.paths.direct} />
        <meta property="og:image" content={data.paths.direct} />
      </Head>
      <div className={classes}>
        <img
          className="object-contain "
          src={data.paths.direct}
          alt={data.displayName}
          height={data.height || undefined}
          width={data.width || undefined}
        />
      </div>
    </Fragment>
  );
};

EmbedImage.embeddable = (data: Embeddable) => {
  switch (data.type) {
    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
    case 'image/svg+xml':
    case 'image/webp':
    case 'image/bmp':
    case 'image/tiff':
      return true;
    default:
      return false;
  }
};