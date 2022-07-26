import classNames from 'classnames';
import { BASE_EMBED_CLASSES } from '../embed';
import type { Embeddable } from '../embeddable';

export const EmbedVideo = ({ file }: { file: Embeddable }) => {
  const classes = classNames('outline-none', BASE_EMBED_CLASSES);
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
    case 'video/ogg':
      return true;
    default:
      return false;
  }
};
