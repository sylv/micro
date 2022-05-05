import { GetFileData } from "@micro/api";
import { FC, useMemo } from "react";
import { FileEmbedContainer } from "./file-embed-container";
import { FileEmbedDefault } from "./file-embed-default";
import { FileEmbedImage } from "./file-embed-image";
import { FileEmbedMarkdown } from "./file-embed-markdown";
import { FileEmbedText } from "./file-embed-text";
import { FileEmbedVideo } from "./file-embed-video";

export const FileEmbed: FC<{ file: GetFileData }> = (props) => {
  const isText = useMemo(() => FileEmbedText.embeddable(props.file), [props.file]);
  const isImage = useMemo(() => FileEmbedImage.embeddable(props.file), [props.file]);
  const isVideo = useMemo(() => FileEmbedVideo.embeddable(props.file), [props.file]);
  const isMarkdown = useMemo(() => FileEmbedMarkdown.embeddable(props.file), [props.file]);

  if (isMarkdown) {
    return <FileEmbedMarkdown file={props.file} />;
  }

  if (isText) {
    return (
      <FileEmbedContainer file={props.file}>
        <FileEmbedText file={props.file} />
      </FileEmbedContainer>
    );
  }

  if (isImage) {
    return (
      <FileEmbedContainer file={props.file}>
        <FileEmbedImage file={props.file} />
      </FileEmbedContainer>
    );
  }

  if (isVideo) {
    return (
      <FileEmbedContainer file={props.file}>
        <FileEmbedVideo file={props.file} />
      </FileEmbedContainer>
    );
  }

  return (
    <FileEmbedContainer file={props.file}>
      <FileEmbedDefault file={props.file} />
    </FileEmbedContainer>
  );
};
