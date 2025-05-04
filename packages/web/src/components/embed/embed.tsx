import type { FC } from "react";
import type { Embeddable } from "./embeddable";
import { EmbedDefault } from "./variants/embed-default";
import { EmbedImage } from "./variants/embed-image";
import { EmbedMarkdown } from "./variants/embed-markdown";
import { EmbedText } from "./variants/embed-text";
import { EmbedVideo } from "./variants/embed-video";
import { EmbedDocument } from "./variants/embed-document";

interface EmbedProps {
  data: Embeddable;
}

export const MAX_HEIGHT = "max-h-[70vh]";
export const BASE_EMBED_CLASSES = "min-h-[150px] bg-dark-200 rounded-lg w-full";

export const Embed: FC<EmbedProps> = ({ data }) => {
  const isText = EmbedText.embeddable(data);
  const isImage = EmbedImage.embeddable(data);
  const isVideo = EmbedVideo.embeddable(data);
  const isMarkdown = EmbedMarkdown.embeddable(data);
  const isDocument = EmbedDocument.embeddable(data);

  if (isDocument) {
    return <EmbedDocument file={data} />;
  }

  if (isMarkdown) {
    return <EmbedMarkdown data={data} />;
  }

  if (isText) {
    return <EmbedText data={data} />;
  }

  if (isImage) {
    return <EmbedImage data={data} />;
  }

  if (isVideo) {
    return <EmbedVideo file={data} />;
  }

  return <EmbedDefault data={data} />;
};
