import type { FC } from 'react';
import { memo, useMemo } from 'react';
import { EmbedContainer } from './embed-container';
import type { Embeddable } from './embeddable';
import { EmbedDefault } from './variants/embed-default';
import { EmbedImage } from './variants/embed-image';
import { EmbedMarkdown } from './variants/embed-markdown';
import { EmbedText } from './variants/embed-text';
import { EmbedVideo } from './variants/embed-video';

interface EmbedProps {
  data: Embeddable;
}

export const BASE_EMBED_CLASSES = 'min-h-[25em] max-h-[70vh] bg-dark-200 rounded-lg w-full';

export const Embed: FC<EmbedProps> = memo(({ data }) => {
  const isText = useMemo(() => EmbedText.embeddable(data), [data]);
  const isImage = useMemo(() => EmbedImage.embeddable(data), [data]);
  const isVideo = useMemo(() => EmbedVideo.embeddable(data), [data]);
  const isMarkdown = useMemo(() => EmbedMarkdown.embeddable(data), [data]);

  if (isMarkdown) {
    return (
      <EmbedContainer data={data}>
        <EmbedMarkdown data={data} />
      </EmbedContainer>
    );
  }

  if (isText) {
    return (
      <EmbedContainer data={data}>
        <EmbedText data={data} />
      </EmbedContainer>
    );
  }

  if (isImage) {
    return (
      <EmbedContainer data={data}>
        <EmbedImage data={data} />
      </EmbedContainer>
    );
  }

  if (isVideo) {
    return (
      <EmbedContainer data={data}>
        <EmbedVideo file={data} />
      </EmbedContainer>
    );
  }

  return (
    <EmbedContainer data={data}>
      <EmbedDefault data={data} />
    </EmbedContainer>
  );
});
