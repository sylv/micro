import { useMutation, useQuery } from '@apollo/client';
import clsx from 'clsx';
import copyToClipboard from 'copy-to-clipboard';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { FiDownload, FiShare, FiTrash } from 'react-icons/fi';
import { graphql } from '../../../@generated';
import { Container } from '../../../components/container';
import { Embed } from '../../../components/embed/embed';
import { Error } from '../../../components/error';
import { PageLoader } from '../../../components/page-loader';
import { Spinner } from '../../../components/spinner';
import { Title } from '../../../components/title';
import { useToasts } from '../../../components/toast';
import { downloadUrl } from '../../../helpers/download.helper';
import { navigate } from '../../../helpers/routing';
import { useAsync } from '../../../hooks/useAsync';
import { useQueryState } from '../../../hooks/useQueryState';
import { PageProps } from '../../../renderer/types';

const GetFile = graphql(`
  query GetFile($fileId: ID!) {
    file(fileId: $fileId) {
      id
      type
      displayName
      size
      sizeFormatted
      textContent
      isOwner
      metadata {
        height
        width
      }
      paths {
        view
        thumbnail
        direct
      }
      urls {
        view
      }
    }
  }
`);

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
    'flex items-center gap-2 shrink-0 transition-colors duration-100 hover:text-gray-300',
    className,
  );

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

export const Page: FC<PageProps> = ({ routeParams }) => {
  const fileId = routeParams.fileId;
  const [deleteKey] = useQueryState<string | undefined>('deleteKey');
  const [confirm, setConfirm] = useState(false);
  const createToast = useToasts();
  const file = useQuery(GetFile, {
    skip: !fileId,
    variables: {
      fileId: fileId as string,
    },
  });

  const [deleteMutation] = useMutation(DeleteFile);
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
    navigate('/dashboard', { overwriteLastHistoryEntry: true });
  });

  if (file.error) {
    return <Error error={file.error} />;
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
              textContent: file.data.file.textContent,
            }}
          />
        </div>
        <div className="flex md:flex-col">
          <div className="flex text-sm gap-3 text-gray-500 cursor-pointer md:flex-col">
            <FileOption onClick={copyLink}>
              <FiShare className="h-4 mr-1" /> Copy link
            </FileOption>
            <FileOption onClick={downloadFile}>
              <FiDownload className="h-4 mr-1" /> Download
            </FileOption>
            {canDelete && (
              <FileOption onClick={deleteFile} className="text-red-400 hover:text-red-500">
                <FiTrash className="h-4 mr-1" />
                {deletingFile ? <Spinner size="small" /> : confirm ? 'Are you sure?' : 'Delete'}
              </FileOption>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
