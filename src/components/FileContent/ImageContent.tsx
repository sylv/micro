import { Image } from "@geist-ui/react";
import Head from "next/head";
import styled from "styled-components";
import { GetFileData } from "../../types";

const ImageContentContainer = styled.div`
  max-height: var(--micro-preview-max-height);
  display: flex;
  margin: 0;
`;

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
