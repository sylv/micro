import { FunctionComponent, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Endpoints } from "@micro/common";
import { http } from "../../helpers/http.helper";
import { GetUserFilesData } from "@micro/api";
import { Card } from "../card";
import { Spinner } from "../spinner";
import { FileListCard } from "./file-list-card";
import Error from "../../pages/_error";

const PER_PAGE = 24;

export const FileList: FunctionComponent = () => {
  const [files, setFiles] = useState<GetUserFilesData>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<any>(null);
  const [offset, setOffset] = useState(0);
  const fetchData = async () => {
    try {
      if (error || loading || !hasMore) return;
      setLoading(true);
      let url = Endpoints.USER_FILES + `?offset=${offset}&limit=${PER_PAGE}`;
      const response = await http(url.toString());
      const body = (await response.json()) as GetUserFilesData;
      const isFullPage = body.length === PER_PAGE;
      setHasMore(isFullPage);
      setOffset(offset + PER_PAGE);
      setFiles(files.concat(body));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!files[0] && !loading) {
    return <Card>You have not uploaded anything yet. Once you do, files will appear here.</Card>;
  }

  if (error) {
    return <Error message={error.message} status={500} />;
  }

  return (
    <InfiniteScroll
      next={fetchData}
      hasMore={hasMore}
      dataLength={files.length}
      style={{ overflow: undefined }}
      loader={
        <div className="flex items-center justify-center m-10">
          <Spinner size="large" />
        </div>
      }
    >
      <div className="pb-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {files.map((file) => (
            <FileListCard key={file.id} file={file} />
          ))}
        </div>
      </div>
    </InfiniteScroll>
  );
};
