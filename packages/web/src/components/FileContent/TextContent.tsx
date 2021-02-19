import { Button, useToasts, useClipboard } from "@geist-ui/react";
import { GetFileData } from "@micro/api";
import Highlight, { defaultProps } from "prism-react-renderer";
import React, { useMemo } from "react";
import useSWR from "swr";
import { PageLoader } from "../PageLoader";
import { DefaultContent } from "./DefaultContent";
import { getLanguage } from "./TextContent.languages";
import { Line, LineContent, LineNo, Pre, TextContentContainer, TextContentCopy } from "./TextContent.styles";
import { theme } from "./TextContent.theme";

const DEFAULT_LANGUAGE = "markdown";

export function checkSupport(file: GetFileData): boolean {
  if (file.type.startsWith("text/")) return true;
  if (getLanguage(file.displayName)) return true;
  return false;
}

export const TextContent = (props: { file: GetFileData }) => {
  const { copy } = useClipboard();
  const [, setToast] = useToasts();
  const content = useSWR(props.file.urls.direct);
  const language = useMemo(() => getLanguage(props.file.displayName) ?? DEFAULT_LANGUAGE, [props.file]);
  if (content.error) {
    return <DefaultContent file={props.file} />;
  }

  if (!content.data) {
    return <PageLoader />;
  }

  const copyContent = () => {
    copy(content.data);
    setToast({ type: "success", text: "Copied file content to clipboard." });
  };

  return (
    <TextContentContainer>
      <TextContentCopy>
        <Button size="mini" onClick={copyContent}>
          Copy Content
        </Button>
      </TextContentCopy>
      <Highlight {...defaultProps} theme={theme} code={content.data} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Pre className={className} style={style}>
            {tokens.map((line, i) => (
              <Line key={i} {...getLineProps({ line, key: i })}>
                <LineNo>{i + 1}</LineNo>
                <LineContent>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </LineContent>
              </Line>
            ))}
          </Pre>
        )}
      </Highlight>
    </TextContentContainer>
  );
};
