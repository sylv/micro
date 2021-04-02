import Highlight, { defaultProps } from "prism-react-renderer";
import React, { FunctionComponent, useMemo } from "react";
import useSWR from "swr";
import { PageLoader } from "../../PageLoader";
import { DefaultViewer } from "../DefaultViewer";
import { getLanguage } from "./languages";
import { theme } from "./theme";
import { GetFileData } from "../../../types";
import { http } from "../../../helpers/http";
import classNames from "classnames";
import copyToClipboard from "copy-to-clipboard";
import { Button } from "../../Button";
import { useToasts } from "../../../hooks/useToasts";

const DEFAULT_LANGUAGE = "markdown";
const fetcher = async (url: string) => {
  const response = await http(url);
  return response.text();
};

export const checkTextSupport = (file: GetFileData): boolean => {
  if (file.type.startsWith("text/")) return true;
  if (getLanguage(file.displayName)) return true;
  return false;
};

export const TextViewer: FunctionComponent<{ file: GetFileData }> = (props) => {
  const setToast = useToasts();
  const content = useSWR<string>(props.file.urls.direct, { fetcher });
  const language = useMemo(() => getLanguage(props.file.displayName) ?? DEFAULT_LANGUAGE, [props.file]);
  if (content.error) {
    return <DefaultViewer file={props.file} />;
  }

  if (!content.data) {
    return <PageLoader />;
  }

  const copyContent = () => {
    copyToClipboard(content.data!);
    setToast({ text: "Copied file content to clipboard." });
  };

  return (
    <div className="relative ">
      <div className="absolute top-0 right-0 m-2 transition duration-100 opacity-25 hover:opacity-100">
        <Button size="mini" onClick={copyContent}>
          Copy Content
        </Button>
      </div>
      <Highlight {...defaultProps} theme={theme} code={content.data} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={classNames(className, "text-left mx-1 p-0.5 overflow-auto max-h-96")} style={style}>
            {tokens.map((line, i) => {
              const props = getLineProps({ line, key: i });
              return (
                <div {...props} className={classNames(props.className, "table-row")} key={i}>
                  <span className="table-cell pr-1 text-sm text-gray-500 select-none">{i + 1}</span>
                  <span className="table-cell">
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
