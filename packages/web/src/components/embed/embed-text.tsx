import { Language } from "prism-react-renderer";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { getFileLanguage } from "../../helpers/get-file-language.helper";
import { PageLoader } from "../page-loader";
import { SyntaxHighlighter } from "../syntax-highlighter/syntax-highlighter";
import { EmbedDefault } from "./embed-default";
import { Embeddable } from "./embeddable";
import { textFetcher } from "./text-fetcher";

const DEFAULT_LANGUAGE = getFileLanguage("diff")!;
const MAX_SIZE = 1_000_000; // 1mb

export const EmbedText = ({ data }: { data: Embeddable }) => {
  const [language, setLanguage] = useState(getFileLanguage(data.displayName) ?? DEFAULT_LANGUAGE);
  const content = data.content ?? useSWR<string>(data.paths.direct, { fetcher: textFetcher });

  useEffect(() => {
    // re-calculate language on fileName change
    setLanguage(getFileLanguage(data.displayName) ?? DEFAULT_LANGUAGE);
  }, [data.displayName]);

  if (content.error) {
    return <EmbedDefault data={data} />;
  }

  if (!content.data) {
    return <PageLoader />;
  }

  return (
    <SyntaxHighlighter language={language.key as Language} parentClassName="w-full h-full">
      {content.data}
    </SyntaxHighlighter>
  );
};

EmbedText.embeddable = (data: Embeddable) => {
  if (data.type.startsWith("text/")) return true;
  if (getFileLanguage(data.displayName)) return true;
  if (data.size > MAX_SIZE) return false;
  return false;
};
