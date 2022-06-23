import type { FC } from 'react';
import { useMemo } from 'react';
import { EmbedContainer } from './embed-container';
import { EmbedDefault } from './embed-default';
import { EmbedImage } from './embed-image';
import { EmbedMarkdown } from './embed-markdown';
import { EmbedText } from './embed-text';
import { EmbedVideo } from './embed-video';
import type { Embeddable } from './embeddable';

export const Embed: FC<{ data: Embeddable }> = ({ data }) => {
  const isText = useMemo(() => EmbedText.embeddable(data), [data]);
  const isImage = useMemo(() => EmbedImage.embeddable(data), [data]);
  const isVideo = useMemo(() => EmbedVideo.embeddable(data), [data]);
  const isMarkdown = useMemo(() => EmbedMarkdown.embeddable(data), [data]);

  if (isMarkdown) {
    return <EmbedMarkdown data={data} />;
  }

  if (isText) {
    return (
      <EmbedContainer centre={false} data={data}>
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
};
