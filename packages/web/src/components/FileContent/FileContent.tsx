import { GetFileData } from "@micro/api";
import { ImageContent } from "./ImageContent";
import { TextContent, checkSupport } from "./TextContent";
import { DefaultContent } from "./DefaultContent";
import Head from "next/head";
import styled from "styled-components";
import { VideoContent } from "./VideoContent";
import { useMemo } from "react";

const FileContentContainer = styled.div`
  max-height: var(--micro-preview-max-height);
  min-height: var(--micro-preview-min-height);
`;

const FileContentWrapper = (props: { file: GetFileData; children: React.ReactChild }) => {
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

export const FileContent = (props: { file: GetFileData }) => {
  const isText = useMemo(() => checkSupport(props.file), [props.file]);
  if (isText) {
    return (
      <FileContentWrapper file={props.file}>
        <TextContent file={props.file} />
      </FileContentWrapper>
    );
  }

  switch (props.file.category) {
    case "image":
      return (
        <FileContentWrapper file={props.file}>
          <ImageContent file={props.file} />
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
