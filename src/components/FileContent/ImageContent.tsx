import { Image } from "@geist-ui/react";
import Head from "next/head";
import { EMBEDDABLE_IMAGE_TYPES } from "src/constants";
import styled from "styled-components";
import { GetFileData } from "../../types";

const ImageContentContainer = styled.div`
  max-height: var(--micro-preview-max-height);
  min-height: var(--micro-preview-min-height);
  border-bottom: 1px solid var(--accents-3);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
`;

export function checkImageSupport(file: GetFileData) {
  return EMBEDDABLE_IMAGE_TYPES.includes(file.type);
}

export const ImageContent = (props: { file: GetFileData }) => {
  return (
    <ImageContentContainer>
      <Head>
        <meta name="twitter:image" content={props.file.urls.direct} />
        <meta property="og:image" content={props.file.urls.direct} />
      </Head>
      <Image src={props.file.urls.direct} alt={props.file.displayName} />
    </ImageContentContainer>
  );
};
