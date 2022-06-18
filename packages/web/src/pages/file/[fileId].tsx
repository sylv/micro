import { GetFileData } from "@ryanke/micro-api";
import classNames from "classnames";
import copyToClipboard from "copy-to-clipboard";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { FC, ReactNode, useState } from "react";
import { Download, Share, Trash } from "react-feather";
import useSWR from "swr";
import { Container } from "../../components/container";
import { FileEmbed } from "../../components/file-embed/file-embed";
import { PageLoader } from "../../components/page-loader";
import { Spinner } from "../../components/spinner";
import { Title } from "../../components/title";
import { downloadUrl } from "../../helpers/download.helper";
import { fetcher } from "../../helpers/fetcher.helper";
import { formatBytes } from "../../helpers/format-bytes.helper";
import { getErrorMessage } from "../../helpers/get-error-message.helper";
import { http, HTTPError } from "../../helpers/http.helper";
import { useToasts } from "../../hooks/use-toasts.helper";
import { useUser } from "../../hooks/use-user.helper";
import ErrorPage from "../_error";

export interface FileProps {
  fallbackData: GetFileData;
}

const FileOption: FC<{ children: ReactNode; className?: string; onClick: () => void }> = ({
  children,
  className,
  onClick,
}) => {
  const classes = classNames(
    "flex items-center gap-2 shrink-0 transition-colors duration-100 hover:text-gray-300",
    className
  );
  return (
    <span className={classes} onClick={onClick}>
      {children}
    </span>
  );
};

export default function File({ fallbackData }: FileProps) {
  const router = useRouter();
  const fileId = router.query.fileId;
  const file = useSWR<GetFileData>(router.query.fileId ? `file/${fileId}` : null, {
    fallbackData: fallbackData,
    revalidateOnMount: !fallbackData,
  });

  const user = useUser();
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const setToast = useToasts();

  if (file.error) {
    return <ErrorPage status={file.error.status} message={file.error.text} />;
  }

  if (!file.data) {
    return <PageLoader />;
  }

  const copyLink = () => {
    copyToClipboard(window.location.href);
    setToast({
      text: `Copied link to clipboard`,
    });
  };

  const downloadFile = async () => {
    try {
      await downloadUrl(file.data!.paths.direct, file.data!.displayName);
    } catch (error: unknown) {
      const message = getErrorMessage(error) ?? "An unknown error occurred";
      setToast({ error: true, text: message });
    }
  };

  const deleteFile = async () => {
    if (!file.data) return;
    if (!confirm) {
      setConfirm(true);
      return;
    }

    try {
      setDeleting(true);
      await http(`file/${file.data.id}`, {
        method: "DELETE",
      });

      setDeleting(false);
      setToast({ text: `Deleted "${file.data.displayName}"` });
      router.replace("/dashboard");
    } catch (error: unknown) {
      const message = getErrorMessage(error) ?? "An unknown error occurred";
      setToast({ error: true, text: message });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container className="mt-5 md-2 md:mt-10 md:mb-5">
      <Title>{file.data.displayName}</Title>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <div className="flex items-end col-span-5">
          <h1 className="mr-2 text-xl font-bold truncate md:text-4xl md:break-all">{file.data.displayName}</h1>
          <span className="text-xs text-gray-500">{formatBytes(file.data.size)}</span>
        </div>
        <FileEmbed file={file.data} />
        <div className="flex md:flex-col">
          <div className="flex text-sm gap-3 text-gray-500 cursor-pointer md:flex-col">
            <FileOption onClick={copyLink}>
              <Share className="h-4 mr-1" /> Copy link
            </FileOption>
            <FileOption onClick={downloadFile}>
              <Download className="h-4 mr-1" /> Download
            </FileOption>
            {user.data?.id === file.data.owner?.id && (
              <FileOption onClick={deleteFile} className="text-red-400 hover:text-red-500">
                <Trash className="h-4 mr-1" />
                {deleting ? <Spinner size="small" /> : confirm ? "Are you sure?" : "Delete"}
              </FileOption>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<FileProps>> {
  // why on earth does nextjs, where the entire point is ssr, not have
  // an easy way to handle basic errors like 404 when server-side rendering? why cant it just catch the error
  // and pass it to my custom error page where i can have custom error handling?
  // why do i have to manually handle the error each time?
  // yes, im salty about it.

  try {
    const fallbackData = await fetcher<GetFileData>(`file/${context.query.fileId}`);
    return { props: { fallbackData } };
  } catch (error) {
    if (error instanceof HTTPError) {
      return { notFound: true };
    }

    throw error;
  }
}
