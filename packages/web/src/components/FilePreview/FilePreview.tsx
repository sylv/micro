import { Card, Grid } from "@geist-ui/react";
import { Download, Trash2 } from "@geist-ui/react-icons";
import { File } from "@micro/api";
import styled from "styled-components";
import { FilePreviewIcon } from "./FilePreviewIcon";

export interface FilePreviewProps {
  file?: File;
}

const ControlsContainer = styled.div`
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  width: 100%;
  z-index: 2;
  padding: 0.5em 0.75em;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    opacity: 1;
    background: rgb(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }
  svg {
    height: 2em;
    width: 2em;
    margin: 0.25em;
  }
`;

export function FilePreview(props: FilePreviewProps) {
  // todo: won't work in prod
  return (
    <Grid xs={4}>
      <Card hoverable className="relative">
        <FilePreviewIcon {...props} />
        <ControlsContainer>
          <Trash2 color="#ee6b6b" />
          <Download />
        </ControlsContainer>
        {props.file?.original_name ?? props.file?.id ?? "loading"}
      </Card>
    </Grid>
  );
}
