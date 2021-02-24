import { Grid } from "@geist-ui/react";
import { QuestionCircle } from "@geist-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import { GetFileData } from "../types";

const FileCardContainer = styled.a`
  background: var(--micro-background);
  border: 1px solid var(--accents-2);
  border-radius: var(--micro-radius);
  color: var(--micro-foreground);
  width: 100%;
  transition: box-shadow 100ms;
  :hover {
    box-shadow: 0 0 1px 1px var(--accents-2);
  }
`;

const FileCardImageContainer = styled.div`
  height: 8em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: var(--accents-5);
  padding: var(--micro-gap-quarter);
  img {
    width: 100%;
    height: 100%;
    display: flex;
    object-fit: contain;
  }
  svg {
    width: auto;
    height: 1.2em;
    margin-bottom: 0.25em;
  }
  span {
    color: var(--accents-4);
    font-size: 0.75rem;
  }
`;

const FileCardFooter = styled.div`
  border-top: 1px solid var(--accents-2);
  padding: var(--micro-gap-half);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function FileCardImage(props: { file: GetFileData }) {
  const [errored, setErrored] = useState(false);
  if (!props.file.urls.thumbnail || errored) {
    return (
      <FileCardImageContainer>
        <QuestionCircle />
        <span>{props.file?.type}</span>
      </FileCardImageContainer>
    );
  }

  return (
    <FileCardImageContainer>
      <img src={props.file.urls.thumbnail} loading="lazy" decoding="async" onError={() => setErrored(true)} />
    </FileCardImageContainer>
  );
}

export function FileCard(props: { file: GetFileData }) {
  return (
    <Grid xs={4}>
      <Link href={props.file.urls.view} passHref>
        <FileCardContainer>
          <FileCardImage {...props} />
          <FileCardFooter>{props.file.displayName}</FileCardFooter>
        </FileCardContainer>
      </Link>
    </Grid>
  );
}
