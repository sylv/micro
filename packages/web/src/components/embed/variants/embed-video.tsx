import clsx from 'clsx';
import { BASE_EMBED_CLASSES, MAX_HEIGHT } from '../embed';
import type { Embeddable } from '../embeddable';

export const EmbedVideo = ({ file }: { file: Embeddable }) => {
  const classes = clsx('outline-none', BASE_EMBED_CLASSES, MAX_HEIGHT);
  return (
    <video
      controls
      loop
      playsInline
      autoPlay
      className={classes}
      height={file.height || undefined}
      width={file.width || undefined}
    >
      <source src={file.paths.direct} type={file.type} />
    </video>
  );
};

EmbedVideo.embeddable = (data: Embeddable) => {
  switch (data.type) {
    case 'video/mp4':
    case 'video/webm':
    case 'video/ogg': {
      return true;
    }
    default: {
      return false;
    }
  }
};
