import { File as APIFile } from "@micro/api";
import { ImageContent } from "./ImageContent";
import { TextContent } from "./TextContent";
import { DefaultContent } from "./DefaultContent";
import Head from "next/head";
import styled from "styled-components";
import { VideoContent } from "./VideoContent";

const FileContentContainer = styled.div`
  max-height: var(--micro-preview-max-height);
  min-height: var(--micro-preview-min-height);
`;

const FileContentWrapper = (props: { file: APIFile; children: React.ReactChild }) => {
  return (
    <FileContentContainer>
      <Head>
        <meta name="twitter:title" content={props.file.displayName} />
        <meta property="og:title" content={props.file.displayName} />
        <meta property="og:url" content={props.file.url.view} />
        <meta property="og:type" content="article" />
      </Head>
      {props.children}
    </FileContentContainer>
  );
};

export const FileContent = (props: { file: APIFile }) => {
  switch (props.file.category) {
    case "image":
      return (
        <FileContentWrapper file={props.file}>
          <ImageContent file={props.file} />
        </FileContentWrapper>
      );
    case "text":
      return (
        <FileContentWrapper file={props.file}>
          <TextContent file={props.file} />
        </FileContentWrapper>
      );
    case "video":
      return (
        <FileContentWrapper file={props.file}>
          <VideoContent file={props.file} />
        </FileContentWrapper>
      );
    default:
      return (
        <FileContentWrapper file={props.file}>
          <DefaultContent file={props.file} />
        </FileContentWrapper>
      );
  }
};
