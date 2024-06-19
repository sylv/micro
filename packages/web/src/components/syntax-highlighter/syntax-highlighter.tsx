import clsx from "clsx";
import type { Language } from "prism-react-renderer";
import { Highlight } from "prism-react-renderer";
import type { ComponentProps, FC } from "react";
import { useState } from "react";
import { theme } from "./prism-theme";
import { SyntaxHighlighterControls } from "./syntax-highlighter-controls";

interface SyntaxHighlighterProps extends ComponentProps<"pre"> {
  children: string;
  language: Language;
  className?: string;
}

export const SyntaxHighlighter: FC<SyntaxHighlighterProps> = ({
  children,
  language: defaultLanguage,
  className: additionalClasses,
  ...rest
}) => {
  const [language, setLanguage] = useState(defaultLanguage);
  const trimmed = children.trim();

  return (
    <Highlight theme={theme} code={trimmed} language={language}>
      {({ className: highlighterClasses, tokens, getLineProps, getTokenProps }) => {
        const containerClasses = clsx(
          "text-left overflow-x-auto h-full relative",
          highlighterClasses,
          additionalClasses,
        );

        return (
          <pre className={containerClasses} style={{ background: "black" }}>
            <SyntaxHighlighterControls
              language={language}
              onLanguageChange={setLanguage}
              content={children}
            />
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="text-sm text-gray-500 px-2">{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        );
      }}
    </Highlight>
  );
};
