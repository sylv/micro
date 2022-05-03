import { FC } from "react";
import { GetFileData } from "@micro/api";
import { Link } from "../link";
import { FileListCardContent } from "./file-list-card-content";

export interface FileCardProps {
  file: GetFileData;
}

export const FileListCard: FC<FileCardProps> = (props) => {
  return (
    <Link
      className="relative flex items-center justify-center h-full overflow-hidden transition-colors rounded-lg shadow max-h-48 bg-dark-200 hover:bg-dark-400"
      href={props.file.urls.view}
    >
      <FileListCardContent file={props.file} />
    </Link>
  );
};
