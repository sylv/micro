import classNames from 'classnames';
import copyToClipboard from 'copy-to-clipboard';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { Download, Share, Trash } from 'react-feather';
import { addStateToPageProps, initializeApollo } from '../../apollo';
import { Container } from '../../components/container';
import { Embed } from '../../components/embed/embed';
import { PageLoader } from '../../components/page-loader';
import { Spinner } from '../../components/spinner';
import { Title } from '../../components/title';
import { ConfigDocument, GetFileDocument, useDeleteFileMutation, useGetFileQuery } from '../../generated/graphql';
import { downloadUrl } from '../../helpers/download.helper';
import { useAsync } from '../../hooks/useAsync';
import { useQueryState } from '../../hooks/useQueryState';
import { useToasts } from '../../hooks/useToasts';
import ErrorPage from '../_error';

const FileOption: FC<{ children: ReactNode; className?: string; onClick: () => void }> = ({
  children,
  className,
  onClick,
}) => {
  const classes = classNames(
    'flex items-center gap-2 shrink-0 transition-colors duration-100 hover:text-gray-300',
    className
  );

  return (
    <span className={classes} onClick={onClick}>
      {children}
    </span>
  );
};

export default function File() {
  const router = useRouter();
  const fileId = router.query.fileId;
  const [deleteKey] = useQueryState<string | undefined>('deleteKey');
  const [confirm, setConfirm] = useState(false);
  const createToast = useToasts();
  const file = useGetFileQuery({
    skip: !fileId,
    variables: {
      fileId: fileId as string,
    },
  });

  const [deleteMutation] = useDeleteFileMutation();
  const copyLink = () => {
    copyToClipboard(file.data?.file.urls.view ?? window.location.href);
    createToast({
      text: `Copied link to clipboard`,
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
      variables: {
        fileId: file.data.file.id,
        deleteKey: deleteKey,
      },
    });

    createToast({ text: `Deleted "${file.data.file.displayName}"` });
    router.replace('/dashboard');
  });

  if (file.error) {
    return <ErrorPage error={file.error} />;
  }

  if (!file.data) {
    return <PageLoader />;
  }

  const canDelete = file.data.file.isOwner || deleteKey;

  return (
    <Container className="mt-5 md-2 md:mb-5">
      <Title>{file.data.file.displayName}</Title>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 pb-1">
        <div className="flex items-end col-span-5 overflow-hidden whitespace-nowrap pb-1">
          <h1 className="mr-2 text-xl font-bold md:text-4xl md:break-all">{file.data.file.displayName}</h1>
          <span className="text-xs text-gray-500">{file.data.file.sizeFormatted}</span>
        </div>
        <div className="col-span-5">
          <Embed
            data={{
              type: file.data.file.type,
              paths: file.data.file.paths,
              size: file.data.file.size,
              displayName: file.data.file.displayName,
              height: file.data.file.metadata?.height,
              width: file.data.file.metadata?.width,
            }}
          />
        </div>
        <div className="flex md:flex-col">
          <div className="flex text-sm gap-3 text-gray-500 cursor-pointer md:flex-col">
            <FileOption onClick={copyLink}>
              <Share className="h-4 mr-1" /> Copy link
            </FileOption>
            <FileOption onClick={downloadFile}>
              <Download className="h-4 mr-1" /> Download
            </FileOption>
            {canDelete && (
              <FileOption onClick={deleteFile} className="text-red-400 hover:text-red-500">
                <Trash className="h-4 mr-1" />
                {deletingFile ? <Spinner size="small" /> : confirm ? 'Are you sure?' : 'Delete'}
              </FileOption>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = initializeApollo({ context });
  await Promise.all([
    await client.query({
      query: ConfigDocument,
    }),
    await client.query({
      query: GetFileDocument,
      variables: {
        fileId: context.query.fileId,
      },
    }),
  ]);

  return addStateToPageProps(client, {
    props: {},
  });
}
