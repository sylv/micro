import { GetFileData } from "@micro/api";
import styled from "styled-components";

const VideoContainer = styled.div`
  max-height: var(--micro-preview-max-height);
  object-fit: contain;
  justify-content: center;
  display: flex;
  top: 0;
`;

export const VideoContent = (props: { file: GetFileData }) => {
  return (
    <VideoContainer>
      <video controls>
        <source src={props.file.urls.direct} type={props.file.type} />
      </video>
    </VideoContainer>
  );
};
