import clsx from 'clsx';
import type { Language } from 'prism-react-renderer';
import { Highlight } from 'prism-react-renderer';
import type { HTMLProps } from 'react';
import { memo, useState } from 'react';
import { theme } from './prism-theme';
import { SyntaxHighlighterControls } from './syntax-highlighter-controls';

export interface SyntaxHighlighterProps extends HTMLProps<HTMLPreElement> {
  children: string;
  language: Language;
  className?: string;
}

export const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ children, language: defaultLanguage, className: additionalClasses, ...rest }) => {
    const [language, setLanguage] = useState(defaultLanguage);
    const trimmed = children.trim();

    return (
      <Highlight theme={theme} code={trimmed} language={language}>
        {({ className: highlighterClasses, style, tokens, getLineProps, getTokenProps }) => {
          console.log(highlighterClasses);
          const containerClasses = clsx(
            'text-left overflow-x-auto h-full relative',
            highlighterClasses,
            additionalClasses
          );

          return (
            <pre className={containerClasses} style={{ background: 'black' }}>
              <SyntaxHighlighterControls language={language} onLanguageChange={setLanguage} content={children} />
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
  }
);
