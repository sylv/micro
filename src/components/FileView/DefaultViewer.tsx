import styled from "styled-components";
import { File as FileIcon } from "@geist-ui/react-icons";
import { GetFileData } from "../../types";

export const DefaultViewerContainer = styled.div`
  height: var(--micro-preview-min-height);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  > * {
    margin: 0;
  }
  span {
    display: flex;
    align-items: center;
    color: var(--accents-4);
  }
  svg {
    height: 1rem;
  }
`;

export const DefaultViewer = (props: { file: GetFileData }) => {
  return (
    <DefaultViewerContainer>
      <h1>{props.file.displayName}</h1>
      <span>
        <FileIcon /> {props.file.type}
      </span>
    </DefaultViewerContainer>
  );
};
