import { Card, Grid, useToasts } from "@geist-ui/react";
import { Download, Trash2 } from "@geist-ui/react-icons";
import { File } from "@micro/api";
import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import { mutate } from "swr";
import { Endpoints } from "../../constants";
import { getToken } from "../../hooks/useUser";
import { FileCardPreview } from "./FileCardPreview";

export interface FilePreviewProps {
  file?: File;
  files?: File[];
}

const ControlsContainer = styled.div`
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  width: 100%;
  z-index: 2;
  padding: 0.5em 0.75em;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    opacity: 1;
    background: rgb(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }
  svg {
    height: 2em;
    width: 2em;
    margin: 0.25em;
  }
  a {
    color: white;
  }
`;

const DeleteButton = styled.div`
  cursor: pointer;
`;

export function FileCard(props: FilePreviewProps) {
  const [deleting, setDeleting] = useState(false);
  const url = props.file && `/api/i/${props.file.key}`;
  const name = props.file?.original_name ?? props.file?.id ?? "loading";
  const [, setToast] = useToasts();

  async function deleteFile() {
    if (deleting || !props.file || !props.files) return;
    const confirmation = confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`) // prettier-ignore
    if (!confirmation) return;
    setDeleting(true);

    try {
      const options = { headers: { Authorization: getToken() } };
      await axios.delete(url, options);
      // todo: this will break with pagination
      const filtered = props.files.filter((file) => file.id !== props.file.id);
      mutate(Endpoints.USER_FILES, filtered, false);
    } catch (e) {
      setToast({ type: "error", text: e.message });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Grid xs={4}>
      <Card hoverable>
        <FileCardPreview {...props} />
        <ControlsContainer>
          <DeleteButton onClick={deleteFile}>
            <Trash2 color="#ee6b6b" />
          </DeleteButton>
          <a href={url} target="_blank">
            <Download />
          </a>
        </ControlsContainer>
        <Card.Footer>{name}</Card.Footer>
      </Card>
    </Grid>
  );
}
