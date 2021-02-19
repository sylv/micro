import { Card, Grid } from "@geist-ui/react";
import { GetFileData } from "@micro/api";
import { FileCardPreview } from "./FileCardPreview";
import Link from "next/link";

export interface FileCardProps {
  file: GetFileData;
}

export function FileCard(props: FileCardProps) {
  return (
    <Grid xs={4}>
      <Link href={props.file.url.view} passHref>
        <a>
          <Card hoverable>
            <FileCardPreview {...props} />
            <Card.Footer>{props.file.displayName}</Card.Footer>
          </Card>
        </a>
      </Link>
    </Grid>
  );
}
