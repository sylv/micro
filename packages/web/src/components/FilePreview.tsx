import { Card, Grid } from "@geist-ui/react";
import { File } from "@micro/api";

export interface FilePreviewProps {
  file?: File;
}

export function FilePreview(props: FilePreviewProps) {
  // todo: won't work in prod
  const thumbnailUrl = props.file?.supports_thumbnails && "/api/t/" + props.file.extension_key;

  return (
    <Grid xs={4}>
      <Card>
        <img height="128px" width="auto" src={thumbnailUrl} />
        {props.file?.original_name ?? props.file?.id ?? "loading"}
      </Card>
    </Grid>
  );
}
