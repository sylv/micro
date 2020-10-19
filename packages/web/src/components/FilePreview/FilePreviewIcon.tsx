import { File } from "@geist-ui/react-icons";
import { useState } from "react";
import styled from "styled-components";
import { FilePreviewProps } from "./FilePreview";

const IconWrapper = styled.div`
  height: 128px;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  flex-direction: column;
  user-select: none;
  svg {
    height: 25%;
    width: 25%;
  }
  span {
    font-size: 0.65rem;
  }
`;

export function FilePreviewIcon(props: FilePreviewProps) {
  const [errored, setErrored] = useState(false);
  const thumbnailUrl = props.file?.supports_thumbnails && !errored && "/api/t/" + props.file.extension_key; // prettier-ignore
  if (!thumbnailUrl) {
    return (
      <IconWrapper>
        <File />
        <span>{props.file?.mime_type}</span>
      </IconWrapper>
    );
  }

  return (
    <IconWrapper>
      <img height="100%" width="100%" src={thumbnailUrl} onError={() => setErrored(true)} />
    </IconWrapper>
  );
}
