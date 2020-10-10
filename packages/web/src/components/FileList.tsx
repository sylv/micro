import { Card, Grid, Text } from "@geist-ui/react";
import { FileCard } from "./FileCard/FileCard";
import useSWR from "swr";
import { UserFilesResponse } from "@micro/api";
import { Endpoints } from "../constants";

const LOADING_SKELETON_COUNT = 24;

export function FileList() {
  // todo: pagination
  const files = useSWR<UserFilesResponse>(Endpoints.USER_FILES);
  if (files.data && !files.data[0]) {
    return (
      <Grid xs={24}>
        <Card>
          <Text type="secondary">Upload something and it will appear here!</Text>
        </Card>
      </Grid>
    );
  }

  const total = files.data?.length ?? LOADING_SKELETON_COUNT;
  const elements: JSX.Element[] = [];
  for (let i = 0; i < total; i++) {
    const file = files.data?.[i];
    const key = file?.id ?? `skeleton${i}`;
    elements.push(<FileCard file={file} key={key} />);
  }

  return <>{elements}</>;
}
