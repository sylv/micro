import useSWR from "swr";
import { Markdown } from "../markdown";
import { PageLoader } from "../page-loader";
import { EmbedContainer } from "./embed-container";
import { EmbedDefault } from "./embed-default";
import { Embeddable } from "./embeddable";
import { textFetcher } from "./text-fetcher";

export const EmbedMarkdown = ({ data }: { data: Embeddable }) => {
  const content =
    data.content || useSWR<string>(data.content === undefined ? data.paths.direct : null, { fetcher: textFetcher });

  if (content.error) {
    return (
      <EmbedContainer centre={false} data={data}>
        <EmbedDefault data={data} />
      </EmbedContainer>
    );
  }

  if (!content.data) {
    return <PageLoader />;
  }

  return (
    <EmbedContainer centre={false} data={data} className="max-h-max">
      <Markdown className="p-4">{content.data}</Markdown>
    </EmbedContainer>
  );
};

const MAX_MARKDOWN_SIZE = 1_000_000; // 1mb
EmbedMarkdown.embeddable = (data: Embeddable) => {
  if (data.size > MAX_MARKDOWN_SIZE) return false;
  if (data.type === "text/markdown") return true;
  if (data.type === "text/plain" && data.displayName?.endsWith("md")) return true;
  return false;
};
