import useSWR from "swr";
import { FileCard } from "./FileCard";
import { PageLoader } from "./PageLoader";
import { Endpoints } from "../constants";
import { GetUserFilesData } from "../types";
import { FunctionComponent } from "react";
import { Card } from "./Card";

export const FileList: FunctionComponent = () => {
  const files = useSWR<GetUserFilesData>(Endpoints.USER_FILES);

  if (files.error) {
    <Card className="col-span-full">
      <p>Something went wrong while loading your files.</p>
    </Card>;
  }

  if (!files.data) {
    return <PageLoader />;
  }

  if (!files.data[0]) {
    return (
      <Card className="col-span-full">
        <p>Upload something and it will appear here!</p>
      </Card>
    );
  }

  return (
    <>
      {files.data.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </>
  );
};
