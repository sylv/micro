import { FunctionComponent, useState } from "react";
import { HelpCircle } from "react-feather";
import { GetFileData } from "../types";
import { Link } from "./Link";

export interface FileCardProps {
  file: GetFileData;
}

const FileCardPreview: FunctionComponent<FileCardProps> = (props) => {
  const [errored, setErrored] = useState(false);
  if (!props.file.urls.thumbnail || errored) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full px-2 py-4 align-center">
        <HelpCircle className="h-4" />
        <span className="w-full text-xs text-center truncate">{props.file.type}</span>
      </div>
    );
  }

  return <img src={props.file.urls.thumbnail} loading="lazy" decoding="async" onError={() => setErrored(true)} />;
};

export const FileCard: FunctionComponent<FileCardProps> = (props) => {
  return (
    <Link
      href={props.file.urls.view}
      className="col-span-4 transition duration-100 border rounded md:col-span-1 border-dark-600 hover:border-gray-700"
    >
      <div className="flex items-center justify-center h-24 overflow-hidden text-gray-600">
        <FileCardPreview file={props.file} />
      </div>
      <div className="bottom-0 p-2 text-sm truncate border-t border-dark-600">{props.file.displayName}</div>
    </Link>
  );
};
