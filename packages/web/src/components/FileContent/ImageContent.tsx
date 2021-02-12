import { Image } from "@geist-ui/react";
import { File as APIFile } from "@micro/api";
import Head from "next/head";
import styled from "styled-components";

const ImageContentContainer = styled.div`
  overflow: hidden;
  div {
    max-height: var(--micro-preview-max-height);
  }
  div.img-background {
    object-fit: cover;
    overflow: hidden;
    position: absolute;
    right: 0;
    left: 0;
    img {
      transform: scale(1.01);
      filter: blur(5px);
    }
  }
  div.img-foreground {
    object-fit: contain;
    top: 0;
  }
`;

export const ImageContent = (props: { file: APIFile }) => {
  return (
    <ImageContentContainer>
      <Head>
        <meta name="twitter:image" content={props.file.url.direct} />
        <meta property="og:image" content={props.file.url.direct} />
        {props.file.metadata && (
          <>
            <meta property="og:image:width" content={props.file.metadata.width.toString()} />
            <meta property="og:image:height" content={props.file.metadata.height.toString()} />
          </>
        )}
      </Head>
      {!props.file.metadata?.hasAlpha && (
        <Image className="img-background" src={props.file.url.direct} title={props.file.displayName} />
      )}
      <Image className="img-foreground" src={props.file.url.direct} title={props.file.displayName} />
    </ImageContentContainer>
  );
};
