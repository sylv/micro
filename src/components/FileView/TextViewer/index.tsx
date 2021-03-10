import { Button, useToasts, useClipboard } from "@geist-ui/react";
import Highlight, { defaultProps } from "prism-react-renderer";
import React, { useMemo } from "react";
import useSWR from "swr";
import { PageLoader } from "../../PageLoader";
import { DefaultViewer } from "../DefaultViewer";
import { getLanguage } from "./languages";
import { Line, LineContent, LineNo, Pre, TextViewerContainer, TextViewerCopyButton } from "./styles";
import { theme } from "./theme";
import { GetFileData } from "../../../types";
import { http } from "../../../helpers/http";

const DEFAULT_LANGUAGE = "markdown";

async function fetcher(url: string) {
  const response = await http(url);
  return response.text();
}

export function checkTextSupport(file: GetFileData): boolean {
  if (file.type.startsWith("text/")) return true;
  if (getLanguage(file.displayName)) return true;
  return false;
}

export const TextViewer = (props: { file: GetFileData }) => {
  const { copy } = useClipboard();
  const [, setToast] = useToasts();
  const content = useSWR<string>(props.file.urls.direct, { fetcher });
  const language = useMemo(() => getLanguage(props.file.displayName) ?? DEFAULT_LANGUAGE, [props.file]);
  if (content.error) {
    return <DefaultViewer file={props.file} />;
  }

  if (!content.data) {
    return <PageLoader />;
  }

  const copyContent = () => {
    copy(content.data!);
    setToast({ type: "success", text: "Copied file content to clipboard." });
  };

  return (
    <TextViewerContainer>
      <TextViewerCopyButton>
        <Button size="mini" onClick={copyContent}>
          Copy Content
        </Button>
      </TextViewerCopyButton>
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
    </TextViewerContainer>
  );
};
