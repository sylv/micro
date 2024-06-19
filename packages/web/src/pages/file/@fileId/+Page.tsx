import clsx from "clsx";
import copyToClipboard from "copy-to-clipboard";
import type { FC, ReactNode } from "react";
import { Fragment, useState } from "react";
import { FiDownload, FiShare, FiTrash } from "react-icons/fi";
import { useQuery } from "urql";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { Container } from "../../../components/container";
import { Embed } from "../../../components/embed/embed";
import { Error } from "../../../components/error";
import { Skeleton, SkeletonList } from "../../../components/skeleton";
import { Spinner } from "../../../components/spinner";
import { createToast } from "../../../components/toast/store";
import { graphql } from "../../../graphql";
import { downloadUrl } from "../../../helpers/download.helper";
import { useAsync } from "../../../hooks/useAsync";
import { useErrorMutation } from "../../../hooks/useErrorMutation";
import { useQueryState } from "../../../hooks/useQueryState";
import { GetFile } from "./+data";

const DeleteFile = graphql(`
  mutation DeleteFile($fileId: ID!, $deleteKey: String) {
    deleteFile(fileId: $fileId, key: $deleteKey)
  }
`);

const FileOption: FC<{ children: ReactNode; className?: string; onClick: () => void }> = ({
  children,
  className,
  onClick,
}) => {
  const classes = clsx(
    "flex items-center gap-2 shrink-0 transition-colors duration-100 hover:text-gray-300",
    className,
  );

  return (
    <button className={classes} onClick={onClick} type="button">
      {children}
    </button>
  );
};

export const Page: FC = () => {
  const { routeParams } = usePageContext();
  const fileId = routeParams!.fileId;
  const [deleteKey] = useQueryState<string | undefined>("deleteKey");
  const [confirm, setConfirm] = useState(false);
  const [file] = useQuery({
    query: GetFile,
    pause: !fileId,
    variables: {
      fileId: fileId as string,
    },
  });

  const [, deleteMutation] = useErrorMutation(DeleteFile);
  const copyLink = () => {
    copyToClipboard(file.data?.file.urls.view ?? window.location.href);
    createToast({
      message: "Copied link to clipboard",
    });
  };

  const [downloadFile] = useAsync(async () => {
    if (!file.data) return;
    await downloadUrl(file.data.file.paths.direct, file.data.file.displayName);
  });

  const [deleteFile, deletingFile] = useAsync(async () => {
    if (!file.data) return;
    if (!confirm) {
      setConfirm(true);
      return;
    }

    await deleteMutation({
      fileId: file.data.file.id,
      deleteKey: deleteKey,
    });

    createToast({ message: `Deleted "${file.data.file.displayName}"` });
    navigate("/dashboard", { overwriteLastHistoryEntry: true });
  });

  if (file.error) {
    return <Error error={file.error} />;
  }

  const canDelete = file.data?.file.isOwner || deleteKey;

  return (
    <Container className="mt-5 md-2 md:mb-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 pb-1">
        <div className="flex items-end col-span-5 overflow-hidden whitespace-nowrap pb-1">
          {file.data && (
            <Fragment>
              <h1 className="mr-2 text-xl font-bold md:text-4xl md:break-all">
                {file.data.file.displayName}
              </h1>
              <span className="text-xs text-gray-500">{file.data.file.sizeFormatted}</span>
            </Fragment>
          )}
          {!file.data && <Skeleton className="w-1/2 h-8" />}
        </div>
        <div className="col-span-5">
          {file.data && (
            <Embed
              data={{
                type: file.data.file.type,
                paths: file.data.file.paths,
                size: file.data.file.size,
                displayName: file.data.file.displayName,
                height: file.data.file.metadata?.height,
                width: file.data.file.metadata?.width,
                textContent: file.data.file.textContent,
              }}
            />
          )}
          {!file.data && <Skeleton className="w-full h-[50dvh]" />}
        </div>
        <div className="flex md:flex-col">
          <div className="flex text-sm gap-3 text-gray-500 cursor-pointer md:flex-col">
            {file.data && (
              <Fragment>
                <FileOption onClick={copyLink}>
                  <FiShare className="h-4 mr-1" /> Copy link
                </FileOption>
                <FileOption onClick={downloadFile}>
                  <FiDownload className="h-4 mr-1" /> Download
                </FileOption>
                {canDelete && (
                  <FileOption onClick={deleteFile} className="text-red-400 hover:text-red-500">
                    <FiTrash className="h-4 mr-1" />
                    {deletingFile ? <Spinner size="small" /> : confirm ? "Are you sure?" : "Delete"}
                  </FileOption>
                )}
              </Fragment>
            )}
            {!file.data && (
              <SkeletonList count={3} className="space-y-2">
                <Skeleton className="w-1/2" />
              </SkeletonList>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
