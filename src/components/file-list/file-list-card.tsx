import { FunctionComponent, useState } from "react";
import { FileMinus } from "react-feather";
import { GetFileData } from "../../types";
import { Link } from "../link";

export interface FileCardProps {
  file: GetFileData;
}

const FileListCardContent: FunctionComponent<FileCardProps> = (props) => {
  const [errored, setErrored] = useState(false);
  if (!props.file.urls.thumbnail || errored) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-6 align-center">
        <FileMinus className="mb-2 text-gray-600" />
        <span className="w-full text-center text-gray-500 truncate">{props.file.displayName}</span>
        <span className="w-full text-sm text-center text-gray-800 truncate">{props.file.type}</span>
      </div>
    );
  }

  return (
    <img
      src={props.file.urls.thumbnail}
      className="object-scale-down w-full"
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
};

export const FileListCard: FunctionComponent<FileCardProps> = (props) => {
  return (
    <Link
      className="relative flex items-center justify-center h-full overflow-hidden transition border rounded max-h-56 border-dark-400 hover:border-gray-700"
      href={props.file.urls.view}
    >
      <FileListCardContent file={props.file} />
    </Link>
  );
};
