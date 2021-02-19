import { File as FileIcon } from "@geist-ui/react-icons";
import { useState } from "react";
import styled from "styled-components";
import { FileCardProps } from "./FileCard";

const FileCardPreviewWrapper = styled.div<{ image: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  user-select: none;
  max-height: 5em;
  overflow: hidden;
  max-height: 4em;
  img {
    object-fit: contain;
  }
`;

export function FileCardPreview(props: FileCardProps) {
  const [errored, setErrored] = useState(false);
  const thumbnailUrl = props.file?.urls.thumbnail;
  if (!thumbnailUrl || errored) {
    return (
      <FileCardPreviewWrapper image={false}>
        <FileIcon />
        <span>{props.file?.type}</span>
      </FileCardPreviewWrapper>
    );
  }

  return <img src={thumbnailUrl} onError={() => setErrored(true)} />;
}
