import classNames from 'classnames';
import type { Language } from 'prism-react-renderer';
import Highlight, { defaultProps } from 'prism-react-renderer';
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
      <Highlight {...defaultProps} theme={theme} code={trimmed} language={language}>
        {({ className: highlighterClasses, style, tokens, getLineProps, getTokenProps }) => {
          const containerClasses = classNames(
            'text-left overflow-x-auto h-full relative',
            highlighterClasses,
            additionalClasses
          );

          return (
            <pre className={containerClasses} style={style} {...rest}>
              <SyntaxHighlighterControls language={language} onLanguageChange={setLanguage} content={children} />
              {tokens.map((line, index) => {
                const props = getLineProps({ line, key: index });
                const classes = classNames(props.className, 'table-row whitespace-pre-wrap');

                return (
                  // handled by getLineProps
                  // eslint-disable-next-line react/jsx-key
                  <div {...props} className={classes}>
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
          );
        }}
      </Highlight>
    );
  }
);
