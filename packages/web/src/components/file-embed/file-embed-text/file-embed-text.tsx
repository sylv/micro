import classNames from "classnames";
import Highlight, { defaultProps } from "prism-react-renderer";
import React from "react";
import { getFileLanguage } from "../../../helpers/get-file-language.helper";
import { GetFileData } from "@micro/api";
import { FileEmbedTextContainer } from "./file-embed-text-container";
import { theme } from "./prism-theme";

const MAX_FILE_SIZE = 1_000_000; // 1mb

export const FileEmbedText = ({ file }: { file: GetFileData }) => {
  return (
    <FileEmbedTextContainer file={file}>
      {({ language, content }) => (
        <Highlight {...defaultProps} theme={theme} code={content} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={classNames(className, "text-left overflow-x-auto h-full")} style={style}>
              {tokens.map((line, index) => {
                const props = getLineProps({ line, key: index });
                return (
                  // handled by getLineProps
                  // eslint-disable-next-line react/jsx-key
                  <div {...props} className={classNames(props.className, "table-row")}>
                    <span className="table-cell px-1 text-sm text-gray-500 select-none">{index + 1}</span>
                    <span className="table-cell pl-1">
                      {line.map((token, key) => (
                        // handled by getTokenProps
                        // eslint-disable-next-line react/jsx-key
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      )}
    </FileEmbedTextContainer>
  );
};

FileEmbedText.embeddable = (file: GetFileData) => {
  if (file.type.startsWith("text/")) return true;
  if (getFileLanguage(file.displayName)) return true;
  if (file.size > MAX_FILE_SIZE) return false;
  return false;
};
