import { GetFileData } from "@ryanke/micro-api";
import useSWR from "swr";
import { Markdown } from "../markdown";
import { PageLoader } from "../page-loader";
import { FileEmbedContainer } from "./file-embed-container";
import { FileEmbedDefault } from "./file-embed-default";
import { textFetcher } from "./text-fetcher";

export const FileEmbedMarkdown = ({ file }: { file: GetFileData }) => {
  const content = useSWR<string>(file.paths.direct, { fetcher: textFetcher });

  if (content.error) {
    return (
      <FileEmbedContainer file={file}>
        <FileEmbedDefault file={file} />
      </FileEmbedContainer>
    );
  }

  if (!content.data) {
    return <PageLoader />;
  }

  return (
    <FileEmbedContainer file={file} className="max-h-max">
      <Markdown className="p-4">{content.data}</Markdown>
    </FileEmbedContainer>
  );
};

const MAX_MARKDOWN_SIZE = 1_000_000; // 1mb
FileEmbedMarkdown.embeddable = (file: GetFileData) => {
  if (file.type !== "text/markdown") return false;
  if (file.size > MAX_MARKDOWN_SIZE) return false;
  return true;
};
