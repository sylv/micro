import copyToClipboard from "copy-to-clipboard";
import { Language } from "prism-react-renderer";
import React, { FunctionComponent, useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import useSWR from "swr";
import languages from "../../../data/languages.json";
import { getFileLanguage } from "../../../helpers/get-file-language.helper";
import { http } from "../../../helpers/http.helper";
import { useToasts } from "../../../hooks/use-toasts.helper";
import { GetFileData } from "../../../types";
import { Button } from "../../button/button";
import { Dropdown } from "../../dropdown/dropdown";
import { DropdownTab } from "../../dropdown/dropdown-tab";
import { PageLoader } from "../../page-loader";
import { FileEmbedDefault } from "../file-embed-default";

const DEFAULT_LANGUAGE = getFileLanguage("diff")!;
const fetcher = async (url: string) => {
  const response = await http(url);
  return response.text();
};

export interface FileEmbedTextContainerProps {
  file: GetFileData;
  children: (options: { language: Language; content: string }) => React.ReactChild;
}

export const FileEmbedTextContainer: FunctionComponent<FileEmbedTextContainerProps> = ({ file, children }) => {
  const [language, setLanguage] = useState(getFileLanguage(file.displayName) ?? DEFAULT_LANGUAGE);
  const content = useSWR<string>(file.urls.direct, { fetcher });
  const setToast = useToasts();

  useEffect(() => {
    // re-calculate language on fileName change
    setLanguage(getFileLanguage(file.displayName) ?? DEFAULT_LANGUAGE);
  }, [file.displayName]);

  const copyContent = () => {
    copyToClipboard(content.data!);
    setToast({ text: "Copied file content to clipboard." });
  };

  if (content.error) {
    return <FileEmbedDefault file={file} />;
  }

  if (!content.data) {
    return <PageLoader />;
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute flex p-2 transition opacity-30 right-2 top-2 hover:opacity-100">
        <Button onClick={copyContent} className="mr-2" small>
          Copy
        </Button>
        <Dropdown
          trigger={
            <Button suffix={<ChevronDown />} small>
              {language.name}
            </Button>
          }
        >
          {languages.map((item) => (
            <DropdownTab key={item.key} onClick={() => setLanguage(item)} className="text-xs">
              {item.name}
            </DropdownTab>
          ))}
        </Dropdown>
      </div>
      {children({ language: language.key as Language, content: content.data })}
    </div>
  );
};
