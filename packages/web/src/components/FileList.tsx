import { Card, Grid, Text } from "@geist-ui/react";
import { UserFilesResponse } from "@micro/api";
import useSWR from "swr";
import { Endpoints } from "../constants";
import { FileCard } from "./FileCard/FileCard";
import { PageLoader } from "./PageLoader";

export function FileList() {
  // todo: pagination
  const files = useSWR<UserFilesResponse>(Endpoints.USER_FILES);

  if (files.error) {
    <Grid xs={24}>
      <Card>
        <Text type="secondary">Something went wrong while loading your files.</Text>
      </Card>
    </Grid>;
  }

  if (!files.data) {
    return <PageLoader />;
  }

  if (!files.data[0]) {
    return (
      <Grid xs={24}>
        <Card>
          <Text type="secondary">Upload something and it will appear here!</Text>
        </Card>
      </Grid>
    );
  }

  return (
    <>
      {files.data.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </>
  );
}
