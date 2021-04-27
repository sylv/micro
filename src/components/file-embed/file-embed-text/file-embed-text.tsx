import classNames from "classnames";
import copyToClipboard from "copy-to-clipboard";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import React, { useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import useSWR from "swr";
import languages from "../../../data/languages.json";
import { getLanguage } from "../../../helpers/getLanguage";
import { http } from "../../../helpers/http";
import { useToasts } from "../../../hooks/useToasts";
import { GetFileData } from "../../../types";
import { Button } from "../../button/button";
import { Dropdown } from "../../dropdown/dropdown";
import { DropdownTab } from "../../dropdown/dropdown-tab";
import { PageLoader } from "../../page-loader";
import { FileEmbedDefault } from "../file-embed-default";
import { theme } from "./prism-theme";

const DEFAULT_LANGUAGE_CODE = "markdown";
const MAX_FILE_SIZE = 1000000; // 1mb
const fetcher = async (url: string) => {
  const response = await http(url);
  return response.text();
};

export const FileEmbedText = ({ file }: { file: GetFileData }) => {
  const setToast = useToasts();
  const content = useSWR<string>(file.urls.direct, { fetcher });
  const [language, setLanguage] = useState(getLanguage(file.displayName));
  const languageKey = (language?.key ?? DEFAULT_LANGUAGE_CODE) as Language;

  useEffect(() => {
    // reset language on file change
    setLanguage(getLanguage(file.displayName));
  }, [file.id]);

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
    <div className="relative w-full h-full overflow-auto">
      <div className="absolute flex p-2 transition opacity-30 right-2 top-2 hover:opacity-100">
        <Button onClick={copyContent} className="mr-2">
          Copy
        </Button>
        <Dropdown className="overflow-y-auto max-h-56" trigger={<Button suffix={<ChevronDown />}>Syntax</Button>}>
          {languages.map((language) => (
            <DropdownTab key={language.key} onClick={() => setLanguage(language)} active={language.key === languageKey}>
              {language.name}
            </DropdownTab>
          ))}
        </Dropdown>
      </div>
      <Highlight {...defaultProps} theme={theme} code={content.data} language={languageKey}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={classNames(className, "text-left overflow-x-auto")} style={style}>
            {tokens.map((line, i) => {
              const props = getLineProps({ line, key: i });
              return (
                <div {...props} className={classNames(props.className, "table-row")} key={i}>
                  <span className="table-cell px-1 text-sm text-gray-500 select-none">{i + 1}</span>
                  <span className="table-cell pl-1">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

FileEmbedText.embeddable = (file: GetFileData) => {
  if (file.type.startsWith("text/")) return true;
  if (getLanguage(file.displayName)) return true;
  if (file.size > MAX_FILE_SIZE) return false;
  return false;
};
