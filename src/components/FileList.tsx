import { Card, Grid, Text } from "@geist-ui/react";
import useSWR from "swr";
import { FileCard } from "./FileCard";
import { PageLoader } from "./PageLoader";
import { Endpoints } from "../constants";
import { GetUserFilesData } from "../types";

export function FileList() {
  // todo: pagination
  const files = useSWR<GetUserFilesData>(Endpoints.USER_FILES);

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
