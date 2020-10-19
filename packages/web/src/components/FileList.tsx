import { File } from "@micro/api";
import { FilePreview } from "./FilePreview/FilePreview";
import { Card, Grid, Text } from "@geist-ui/react";

const LOADING_SKELETON_COUNT = 24;
export interface FileListProps {
  files: File[];
}

export function FileList(props: FileListProps) {
  if (props.files && !props.files[0]) {
    return (
      <Grid xs={24}>
        <Card>
          <Text type="secondary">Upload something and it will appear here!</Text>
        </Card>
      </Grid>
    );
  }

  const total = props.files?.length ?? LOADING_SKELETON_COUNT;
  const files: JSX.Element[] = [];
  for (let i = 0; i < total; i++) {
    const file = props.files?.[i];
    const key = file?.id ?? `skeleton${i}`;
    files.push(<FilePreview file={file} key={key} />);
  }

  return <>{files}</>;
}
