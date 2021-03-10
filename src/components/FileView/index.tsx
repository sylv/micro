import { checkImageSupport, ImageViewer } from "./ImageViewer";
import { TextViewer, checkTextSupport } from "./TextViewer";
import { DefaultViewer } from "./DefaultViewer";
import Head from "next/head";
import styled from "styled-components";
import { checkVideoSupport, VideoViewer } from "./VideoViewer";
import { useMemo } from "react";
import { GetFileData } from "../../types";

const FileViewWrapperContainer = styled.div`
  max-height: var(--micro-preview-max-height);
  min-height: var(--micro-preview-min-height);
`;

const FileViewWrapper = (props: { file: GetFileData; children: React.ReactChild }) => {
  return (
    <FileViewWrapperContainer>
      <Head>
        <meta name="twitter:title" content={props.file.displayName} />
        <meta property="og:title" content={props.file.displayName} key="title" />
        <meta property="og:url" content={props.file.urls.view} />
        <meta property="og:type" content="article" />
      </Head>
      {props.children}
    </FileViewWrapperContainer>
  );
};

export const FileView = (props: { file: GetFileData }) => {
  const isText = useMemo(() => checkTextSupport(props.file), [props.file.type]);
  const isImage = useMemo(() => checkImageSupport(props.file), [props.file.type]);
  const isVideo = useMemo(() => checkVideoSupport(props.file), [props.file.type]);

  if (isText) {
    return (
      <FileViewWrapper file={props.file}>
        <TextViewer file={props.file} />
      </FileViewWrapper>
    );
  }

  if (isImage) {
    return (
      <FileViewWrapper file={props.file}>
        <ImageViewer file={props.file} />
      </FileViewWrapper>
    );
  }

  if (isVideo) {
    return (
      <FileViewWrapper file={props.file}>
        <VideoViewer file={props.file} />
      </FileViewWrapper>
    );
  }

  return (
    <FileViewWrapper file={props.file}>
      <DefaultViewer file={props.file} />
    </FileViewWrapper>
  );
};
