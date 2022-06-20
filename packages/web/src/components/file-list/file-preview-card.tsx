import { GetFileData } from "@ryanke/micro-api";
import { FC, useEffect, useState } from "react";
import { FileMinus, Trash } from "react-feather";
import { formatBytes } from "../../helpers/format-bytes.helper";
import { Link } from "../link";
import { MissingPreview } from "./missing-preview";

export interface FileCardProps {
  file: GetFileData;
}

export const FilePreviewCard: FC<FileCardProps> = ({ file }) => {
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoadFailed(false);
  }, [file.id]);

  return (
    <Link href={file.paths.view}>
      <div className="h-44 flex flex-col transition-colors rounded-lg shadow bg-dark-200 hover:bg-dark-400 group overflow-hidden">
        <div className="flex-grow overflow-hidden">
          {file.paths.thumbnail && !loadFailed && (
            <img
              src={file.paths.thumbnail}
              className="object-contain w-full h-full"
              loading="lazy"
              decoding="async"
              height={file.thumbnail?.height}
              width={file.thumbnail?.width}
              onError={() => setLoadFailed(true)}
            />
          )}
          {loadFailed && <MissingPreview text="Load Failed" icon={Trash} type={file.type} />}
          {!file.paths.thumbnail && <MissingPreview text="No Preview" icon={FileMinus} type={file.type} />}
        </div>
        <div className="py-2 px-3 text-sm text-gray-500 group-hover:text-white transition truncate flex items-center gap-2 justify-between">
          <span className="truncate">{file.displayName}</span>
          <span className="text-gray-700 text-xs">{formatBytes(file.size)}</span>
        </div>
      </div>
    </Link>
  );
};
