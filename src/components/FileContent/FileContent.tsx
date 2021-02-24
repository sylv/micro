import { checkImageSupport, ImageContent } from "./ImageContent";
import { TextContent, checkTextSupport } from "./TextContent";
import { DefaultContent } from "./DefaultContent";
import Head from "next/head";
import styled from "styled-components";
import { checkVideoSupport, VideoContent } from "./VideoContent";
import { useMemo } from "react";
import { GetFileData } from "../../types";

const FileContentContainer = styled.div`
  max-height: var(--micro-preview-max-height);
  min-height: var(--micro-preview-min-height);
`;

const FileContentWrapper = (props: { file: GetFileData; children: React.ReactChild }) => {
  return (
    <FileContentContainer>
      <Head>
        <meta name="twitter:title" content={props.file.displayName} />
        <meta property="og:title" content={props.file.displayName} key="title" />
        <meta property="og:url" content={props.file.urls.view} />
        <meta property="og:type" content="article" />
      </Head>
      {props.children}
    </FileContentContainer>
  );
};

export const FileContent = (props: { file: GetFileData }) => {
  const isText = useMemo(() => checkTextSupport(props.file), [props.file.type]);
  const isImage = useMemo(() => checkImageSupport(props.file), [props.file.type]);
  const isVideo = useMemo(() => checkVideoSupport(props.file), [props.file.type]);

  if (isText) {
    return (
      <FileContentWrapper file={props.file}>
        <TextContent file={props.file} />
      </FileContentWrapper>
    );
  }

  if (isImage) {
    return (
      <FileContentWrapper file={props.file}>
        <ImageContent file={props.file} />
      </FileContentWrapper>
    );
  }

  if (isVideo) {
    return (
      <FileContentWrapper file={props.file}>
        <VideoContent file={props.file} />
      </FileContentWrapper>
    );
  }

  return (
    <FileContentWrapper file={props.file}>
      <DefaultContent file={props.file} />
    </FileContentWrapper>
  );
};
