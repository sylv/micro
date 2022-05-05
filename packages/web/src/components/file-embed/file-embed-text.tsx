import { GetFileData } from "@micro/api";
import { Language } from "prism-react-renderer";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { getFileLanguage } from "../../helpers/get-file-language.helper";
import { PageLoader } from "../page-loader";
import { SyntaxHighlighter } from "../syntax-highlighter/syntax-highlighter";
import { FileEmbedDefault } from "./file-embed-default";
import { textFetcher } from "./text-fetcher";

const DEFAULT_LANGUAGE = getFileLanguage("diff")!;
const MAX_FILE_SIZE = 1_000_000; // 1mb

export const FileEmbedText = ({ file }: { file: GetFileData }) => {
  const [language, setLanguage] = useState(getFileLanguage(file.displayName) ?? DEFAULT_LANGUAGE);
  const content = useSWR<string>(file.paths.direct, { fetcher: textFetcher });

  useEffect(() => {
    // re-calculate language on fileName change
    setLanguage(getFileLanguage(file.displayName) ?? DEFAULT_LANGUAGE);
  }, [file.displayName]);

  if (content.error) {
    return <FileEmbedDefault file={file} />;
  }

  if (!content.data) {
    return <PageLoader />;
  }

  return (
    <div className="relative w-full h-full">
      <SyntaxHighlighter language={language.key as Language}>{content.data}</SyntaxHighlighter>
    </div>
  );
};

FileEmbedText.embeddable = (file: GetFileData) => {
  if (file.type.startsWith("text/")) return true;
  if (getFileLanguage(file.displayName)) return true;
  if (file.size > MAX_FILE_SIZE) return false;
  return false;
};
