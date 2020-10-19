import { File } from "@geist-ui/react-icons";
import { useState } from "react";
import styled from "styled-components";
import { FilePreviewProps } from "./FileCard";

const IconWrapper = styled.div<{ image: boolean }>`
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

export function FileCardPreview(props: FilePreviewProps) {
  const [errored, setErrored] = useState(false);
  const thumbnailUrl = props.file?.supports_thumbnails && "/api/t/" + props.file.extension_key; // prettier-ignore
  if (!thumbnailUrl || errored) {
    return (
      <IconWrapper image={false}>
        <File />
        <span>{props.file?.mime_type}</span>
      </IconWrapper>
    );
  }

  return (
    <IconWrapper image>
      <img height="100%" src={thumbnailUrl} onError={() => setErrored(true)} />
    </IconWrapper>
  );
}
