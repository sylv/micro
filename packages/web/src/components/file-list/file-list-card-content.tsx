import { FunctionComponent, useState } from "react";
import { FileMinus } from "react-feather";
import { FileCardProps } from "./file-list-card";

export const FileListCardContent: FunctionComponent<FileCardProps> = (props) => {
  const [errored, setErrored] = useState(false);
  if (!props.file.urls.thumbnail || errored) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-6 align-center">
        <FileMinus className="mb-2 text-gray-500" />
        <span className="w-full text-center text-gray-400 truncate">{props.file.displayName}</span>
        <span className="w-full text-sm text-center text-gray-700 truncate">{props.file.type}</span>
      </div>
    );
  }

  return (
    <img
      src={props.file.urls.thumbnail}
      className="object-contain h-full"
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
};
