import { Card, Grid } from "@geist-ui/react";
import { File } from "@micro/api";
import { FileCardPreview } from "./FileCardPreview";

export interface FileCardProps {
  file: File;
}

export function FileCard(props: FileCardProps) {
  const url = props.file && `/api/i/${props.file.id}`;
  const name = props.file?.name ?? props.file?.id ?? "loading";

  return (
    <Grid xs={4}>
      <a href={url} target="_blank">
        <Card hoverable>
          <FileCardPreview {...props} />
          <Card.Footer>{name}</Card.Footer>
        </Card>
      </a>
    </Grid>
  );
}
