import { FunctionComponent, useMemo } from "react";
import { GetFileData } from "../../types";
import { FileEmbedDefault } from "./file-embed-default";
import { FileEmbedContainer } from "./file-embed-container";
import { FileEmbedText } from "./file-embed-text/file-embed-text";
import { FileEmbedImage } from "./file-embed-image";
import { FileEmbedVideo } from "./file-embed-video";

export const FileEmbed: FunctionComponent<{ file: GetFileData }> = (props) => {
  const isText = useMemo(() => FileEmbedText.embeddable(props.file), [props.file.id]);
  const isImage = useMemo(() => FileEmbedImage.embeddable(props.file.type), [props.file.type]);
  const isVideo = useMemo(() => FileEmbedVideo.embeddable(props.file.type), [props.file.type]);

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
