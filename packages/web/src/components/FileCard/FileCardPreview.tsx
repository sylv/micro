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
  min-height: 5em;
  svg {
    height: 2em;
    width: 2em;
  }
  span {
    font-size: 0.65rem;
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

  return (
    <FileCardPreviewWrapper image>
      <img height="100%" src={thumbnailUrl} onError={() => setErrored(true)} />
    </FileCardPreviewWrapper>
  );
}
