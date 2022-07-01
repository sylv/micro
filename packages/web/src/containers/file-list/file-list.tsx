import type { FC } from 'react';
import { Fragment } from 'react';
import { Breadcrumbs } from '../../components/breadcrumbs';
import { Card } from '../../components/card';
import { PageLoader } from '../../components/page-loader';
import { Toggle } from '../../components/toggle';
import { useGetFilesQuery, useGetPastesQuery } from '../../generated/graphql';
import { useQueryState } from '../../hooks/useQueryState';
import ErrorPage from '../../pages/_error';
import { FileCard } from './cards/file-card';
import { PasteCard } from './cards/paste-card';

const PER_PAGE = 24;

export const FileList: FC = () => {
  const [filter, setFilter] = useQueryState('filter', 'files');
  const files = useGetFilesQuery({ skip: filter !== 'files', variables: { first: PER_PAGE } });
  const pastes = useGetPastesQuery({ skip: filter !== 'pastes', variables: { first: PER_PAGE } });
  const source = filter === 'files' ? files : pastes;
  if (source.error) {
    return <ErrorPage error={source.error} />;
  }

  const currentPageInfo = filter === 'files' ? files.data?.user.files : pastes.data?.user.pastes;
  const hasContent = currentPageInfo?.edges[0];
  const hasNextPage = currentPageInfo?.pageInfo.hasNextPage;

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
        {!source.data && <PageLoader />}
        {filter === 'files' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {files.data?.user.files.edges.map(({ node }) => (
              <FileCard key={node.id} file={node} />
            ))}
          </div>
        )}
        {filter === 'pastes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastes.data?.user.pastes.edges.map(({ node }) => (
              <PasteCard key={node.id} paste={node} />
            ))}
          </div>
        )}
        {!source.loading && !hasContent && (
          <Card className="text-gray-500">
            You haven't uploaded anything yet. Once you upload something, it will appear here.
          </Card>
        )}
      </div>
      {hasNextPage && (
        <button
          className="w-full bg-dark-200 px-2 py-2 text-gray-500 hover:bg-dark-300 transition"
          type="button"
          onClick={() => {
            source.fetchMore({
              variables: {
                after: currentPageInfo.pageInfo.endCursor,
              },
            });
          }}
        >
          Load More
        </button>
      )}
    </Fragment>
  );
};
