import { File as APIFile } from "@micro/api";
import Highlight, { defaultProps } from "prism-react-renderer";
import React, { useMemo } from "react";
import useSWR from "swr";
import { PageLoader } from "../PageLoader";
import { DefaultContent } from "./DefaultContent";
import { getLanguage } from "./TextContent.languages";
import { Line, LineContent, LineNo, Pre, TextContentContainer } from "./TextContent.styles";
import { theme } from "./TextContent.theme";

const DEFAULT_LANGUAGE = "markdown";

export function checkSupport(file: APIFile): boolean {
  if (file.type.startsWith("text/")) return true;
  if (getLanguage(file.displayName)) return true;
  return false;
}

export const TextContent = (props: { file: APIFile }) => {
  const content = useSWR(props.file.url.direct);
  const language = useMemo(() => getLanguage(props.file.displayName) ?? DEFAULT_LANGUAGE, [props.file]);
  if (content.error) {
    return <DefaultContent file={props.file} />;
  }

  if (!content.data) {
    return <PageLoader />;
  }

  return (
    <TextContentContainer>
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
