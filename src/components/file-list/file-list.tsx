import { FunctionComponent, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Endpoints } from "../../constants";
import { http } from "../../helpers/http";
import { GetUserFilesData } from "../../types";
import { Card } from "../card";
import { Spinner } from "../spinner";
import { FileListCard } from "./file-list-card";

const PER_PAGE = 24;

export const FileList: FunctionComponent = () => {
  const [files, setFiles] = useState<GetUserFilesData>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null | undefined>();
  const hasMore = cursor !== null;
  const fetchData = async () => {
    try {
      if (cursor === null) return;
      setLoading(true);
      let url = Endpoints.USER_FILES + `?take=${PER_PAGE}`;
      if (cursor) url += `&cursor=${cursor}`;
      const response = await http(url.toString());
      const body = (await response.json()) as GetUserFilesData;
      const isFullPage = body.length === PER_PAGE;
      setCursor(body[0] && isFullPage ? body[body.length - 1].id : null);
      setFiles((files) => files.concat(body));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!files[0] && !loading) {
    return <Card>You haven't uploaded anything yet. Once you do, files will appear here.</Card>;
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
