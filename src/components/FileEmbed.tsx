import { Button, Card, Tooltip, useClipboard, useToasts } from "@geist-ui/react";
import { Download, FileText, Share2, Clock } from "@geist-ui/react-icons";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import styled from "styled-components";
import { downloadUrl } from "../helpers/downloadUrl";
import { FileView } from "./FileView";
import { formatDate } from "../helpers/formatDate";
import { GetFileData } from "../types";

const FileEmbedContainer = styled.div`
  border: 1px solid var(--accents-2);
  border-radius: var(--micro-radius);
  overflow: hidden;
  img,
  video {
    max-height: var(--micro-preview-max-height);
    min-height: var(--micro-preview-min-height);
    object-fit: contain;
    width: 100%;
  }
`;

const FileEmbedInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1em;
  border-top: 1px solid var(--accents-2);
`;

const FileEmbedName = styled.div`
  align-self: center;
  margin-right: var(--micro-gap);
`;

const FileEmbedButtons = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  button {
    margin-bottom: var(--micro-gap-quarter);
  }
`;

const FileEmbedMetadata = styled.span`
  display: inline-flex;
  align-items: center;
  padding-right: 0.5em;
  font-size: 0.7rem;
  color: var(--accents-5);
  svg {
    height: 1rem;
    width: 1rem;
    margin-right: 0.25em;
  }
`;

export const FileEmbed = (props: { file: GetFileData }) => {
  const [, setToast] = useToasts();
  const [disabled, setDisabled] = useState(false);
  const clipboard = useClipboard();

  const download = async () => {
    try {
      setDisabled(true);
      await downloadUrl(props.file.urls.direct, props.file.displayName);
    } catch (err) {
      setToast({ type: "error", text: err.message });
    } finally {
      setDisabled(false);
    }
  };

  const copy = () => {
    clipboard.copy(window.location.href);
    setToast({
      text: `Copied link to clipboard`,
      type: "success",
    });
  };

  return (
    <FileEmbedContainer>
      <FileView file={props.file} />
      <FileEmbedInfo>
        <FileEmbedName>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>{props.file.displayName}</h1>
          <Tooltip text="File Size">
            <FileEmbedMetadata>
              <FileText /> {prettyBytes(props.file.size)}
            </FileEmbedMetadata>
          </Tooltip>
          <Tooltip text="Created At">
            <FileEmbedMetadata>
              <Clock /> {formatDate(props.file.createdAt)}
            </FileEmbedMetadata>
          </Tooltip>
        </FileEmbedName>
        <FileEmbedButtons>
          <Button icon={<Share2 />} onClick={copy}>
            Copy Link
          </Button>
          <Button icon={<Download />} onClick={download} disabled={disabled}>
            Download
          </Button>
        </FileEmbedButtons>
      </FileEmbedInfo>
    </FileEmbedContainer>
  );
};
