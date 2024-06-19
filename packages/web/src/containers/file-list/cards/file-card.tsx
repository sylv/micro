import { useEffect, useMemo, useState, type FC } from "react";
import { FiFileMinus, FiTrash } from "react-icons/fi";
import { graphql, unmask, type FragmentOf } from "../../../graphql";
import { useConfig } from "../../../hooks/useConfig";
import { MissingPreview } from "../missing-preview";

export const FileCardFrag = graphql(`
  fragment FileCard on File {
    id
    type
    displayName
    sizeFormatted
    thumbnail {
      width
      height
    }
    paths {
      thumbnail
    }
    urls {
      view
    }
  }
`);

interface FileCardProps {
  file: FragmentOf<typeof FileCardFrag>;
}

export const FileCard: FC<FileCardProps> = ({ file: _file }) => {
  const file = unmask(FileCardFrag, _file);
  const [loadFailed, setLoadFailed] = useState(false);
  const config = useConfig();
  const url = useMemo(() => {
    // https://github.com/sylv/micro/issues/21
    // replace hostname so we dont have to calculate the "correct" view url like /i/ ourself
    // that means copy/pasting the link it takes you to is still somewhat correct, even if its the wrong hostname
    const parsed = new URL(file.urls.view);
    if (config.data) {
      parsed.host = config.data.rootHost.normalised;
      parsed.protocol = new URL(config.data.rootHost.url).protocol;
    }

    return parsed.toString();
  }, [config.data, file.urls.view]);

  useEffect(() => {
    setLoadFailed(false);
  }, [file.id]);

  return (
    <a href={url}>
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
              alt={file.displayName}
              onError={() => {
                setLoadFailed(true);
              }}
            />
          )}
          {loadFailed && <MissingPreview text="Load Failed" icon={FiTrash} type={file.type} />}
          {!file.paths.thumbnail && <MissingPreview text="No Preview" icon={FiFileMinus} type={file.type} />}
        </div>
        <div className="py-2 px-3 text-sm text-gray-500 group-hover:text-white transition truncate flex items-center gap-2 justify-between">
          <span className="truncate">{file.displayName}</span>
          <span className="text-gray-700 text-xs ">{file.sizeFormatted}</span>
        </div>
      </div>
    </a>
  );
};
