import classNames from "classnames";
import Highlight, { defaultProps } from "prism-react-renderer";
import React from "react";
import { getLanguage } from "../../../helpers/getLanguage";
import { GetFileData } from "../../../types";
import { FileEmbedTextContainer } from "./file-embed-text-container";
import { theme } from "./prism-theme";

const MAX_FILE_SIZE = 1000000; // 1mb

export const FileEmbedText = ({ file }: { file: GetFileData }) => {
  return (
    <FileEmbedTextContainer file={file}>
      {({ language, content }) => (
        <Highlight {...defaultProps} theme={theme} code={content} language={language}>
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
      )}
    </FileEmbedTextContainer>
  );
};

FileEmbedText.embeddable = (file: GetFileData) => {
  if (file.type.startsWith("text/")) return true;
  if (getLanguage(file.displayName)) return true;
  if (file.size > MAX_FILE_SIZE) return false;
  return false;
};
