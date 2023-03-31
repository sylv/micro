import classNames from 'classnames';
import type { Language } from 'prism-react-renderer';
import { Fragment, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { SyntaxHighlighter } from './syntax-highlighter/syntax-highlighter';

const LANGUAGE_REGEX = /(^| )language-(?<language>.+)$/u;

export const Markdown = memo<{ children: string; className?: string }>(({ children, className }) => {
  const classes = classNames(
    'prose prose-invert max-w-none',
    // remove "" quotes from blockquotes
    'prose-p:before:content-none prose-p:after:content-none',
    // make links purple
    'prose-a:text-primary hover:prose-a:underline prose-a:no-underline',
    // remove italics from blockquotes
    'prose-blockquote:font-normal prose-blockquote:not-italic',
    // make inline `code` blocks purple
    'prose-code:text-primary',
    className
  );

  return (
    <div className={classes}>
      <ReactMarkdown
        // rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            // the code block is wrapped in a pre tag, but we already do that in the
            // prism syntax highlighter. so this just doesnt render the pre tag.
            return <Fragment>{children}</Fragment>;
          },
          code({ inline, className, children, ...rest }) {
            const languageMatch = !inline && className && LANGUAGE_REGEX.exec(className);
            const text = languageMatch ? children.filter((child) => typeof child === 'string').join(' ') : null;
            if (inline || !languageMatch || !text) {
              return (
                <code className={className} {...rest}>
                  {children}
                </code>
              );
            }

            const language = languageMatch.groups!.language as Language;
            return (
              <SyntaxHighlighter language={language} className={className} {...rest}>
                {text}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
});
