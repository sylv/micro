import { File as APIFile } from "@micro/api";
import styled from "styled-components";
import { File as FileIcon } from "@geist-ui/react-icons";

export const DefaultContentContainer = styled.div`
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

export const DefaultContent = (props: { file: APIFile }) => {
  return (
    <DefaultContentContainer>
      <h1>{props.file.displayName}</h1>
      <span>
        <FileIcon /> {props.file.type}
      </span>
    </DefaultContentContainer>
  );
};
