import { Button, Card, Tooltip, useClipboard, useToasts } from "@geist-ui/react";
import { Download, Eye, FileText, Share2 } from "@geist-ui/react-icons";
import { GetFileData } from "@micro/api";
import prettyBytes from "pretty-bytes";
import styled from "styled-components";
import { downloadUrl } from "../helpers/downloadUrl";
import { FileContent } from "./FileContent/FileContent";
import { useState } from "react";

const FileContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  h1 {
    font-size: 2.25rem;
    margin-bottom: 0;
  }
  span {
    color: var(--accents-5);
    font-size: 0.75rem;
  }
`;

const FileContentRight = styled.div`
  display: flex;
`;

const FileContentButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  > :first-child {
    margin-bottom: 0.5em;
  }
`;

const FileContentName = styled.div`
  * + * {
    margin-right: 1em !important;
  }
`;

const FileDetail = styled.span`
  display: inline-flex;
  align-items: center;
  svg {
    height: 1rem;
    width: 1rem;
    margin-right: 0.25em;
  }
`;

// todo: video preview
export const FileViewer = (props: { file: GetFileData }) => {
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
    <Card>
      <FileContent file={props.file} />
      <Card.Content>
        <FileContentHeader>
          <FileContentName>
            <h1>{props.file.displayName}</h1>
            <Tooltip text="Views">
              <FileDetail>
                <Eye /> {props.file.views.toLocaleString()}
              </FileDetail>
            </Tooltip>
            <Tooltip text="File Size">
              <FileDetail>
                <FileText /> {prettyBytes(props.file.size)}
              </FileDetail>
            </Tooltip>
          </FileContentName>
          <FileContentRight>
            <FileContentButtons>
              <Button icon={<Share2 />} onClick={copy}>
                Copy Link
              </Button>
              <Button icon={<Download />} onClick={download} disabled={disabled}>
                Download
              </Button>
            </FileContentButtons>
          </FileContentRight>
        </FileContentHeader>
      </Card.Content>
    </Card>
  );
};
