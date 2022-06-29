import type { GetUserFilesData, GetUserPastesData } from '@ryanke/micro-api';
import type { FC } from 'react';
import { Fragment } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useQueryState } from '../../hooks/use-query-state';
import Error from '../../pages/_error';
import { Breadcrumbs } from '../breadcrumbs';
import { Card } from '../card';
import { PageLoader } from '../page-loader';
import { Toggle } from '../toggle';
import { FilePreviewCard } from './file-preview-card';
import { PastePreviewCard } from './paste-preview-card';

const PER_PAGE = 24;

export const FileList: FC = () => {
  const [filter, setFilter] = useQueryState('filter', 'files');
  const files = useSWRInfinite<GetUserFilesData>((pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData[0]) return null;
    const offset = pageIndex * PER_PAGE;
    return `user/files?limit=${PER_PAGE}&offset=${offset}`;
  });

  const pastes = useSWRInfinite<GetUserPastesData>((pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData[0]) return null;
    const offset = pageIndex * PER_PAGE;
    return `user/pastes?limit=${PER_PAGE}&offset=${offset}`;
  });

  const source = filter === 'files' ? files : pastes;
  if (source.error) {
    return <Error message={source.error.message} status={500} />;
  }

  if (!source.data) {
    return <PageLoader />;
  }

  const latestPage = source.data[source.data.length - 1];
  const hasMore = latestPage && latestPage.length === PER_PAGE;

  return (
    <Fragment>
      <div className="flex justify-between gap-2 mb-6">
        <div>
          <Breadcrumbs to="/">Home</Breadcrumbs>
          <h2 className="capitalize font-bold text-2xl">My {filter}</h2>
        </div>
        <div>
          <Toggle
            selected={filter}
            onChange={({ value }) => setFilter(value)}
            options={[
              {
                label: 'Files',
                value: 'files',
              },
              {
                label: 'Pastes',
                value: 'pastes',
              },
            ]}
          />
        </div>
      </div>
      <div className="pb-5">
        {filter === 'files' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {files.data?.flatMap((page) => page.map((file) => <FilePreviewCard key={file.id} file={file} />))}
          </div>
        )}
        {filter === 'pastes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastes.data?.flatMap((page) => page.map((paste) => <PastePreviewCard key={paste.id} paste={paste} />))}
          </div>
        )}
        {!source.data[0][0] && (
          <Card className="text-gray-500">
            You haven't uploaded anything yet. Once you upload something, it will appear here.
          </Card>
        )}
      </div>
      {hasMore && (
        <button
          className="w-full bg-dark-200 px-2 py-2 text-gray-500 hover:bg-dark-300 transition"
          type="button"
          onClick={() => {
            source.setSize(source.size + 1);
          }}
        >
          Load More
        </button>
      )}
    </Fragment>
  );
};
