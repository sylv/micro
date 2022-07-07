import type { Language } from 'prism-react-renderer';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getFileLanguage } from '../../../helpers/get-file-language.helper';
import { PageLoader } from '../../page-loader';
import { SyntaxHighlighter } from '../../syntax-highlighter/syntax-highlighter';
import { BASE_EMBED_CLASSES } from '../embed';
import type { Embeddable } from '../embeddable';
import { textFetcher } from '../text-fetcher';
import { EmbedDefault } from './embed-default';

const DEFAULT_LANGUAGE = getFileLanguage('diff')!;
const MAX_SIZE = 1_000_000; // 1mb

export const EmbedText = ({ data }: { data: Embeddable }) => {
  const [language, setLanguage] = useState(getFileLanguage(data.displayName) ?? DEFAULT_LANGUAGE);
  const swrContent = useSWR<string>(data.content ? null : data.paths.direct, { fetcher: textFetcher });
  const content = data.content ?? swrContent;

  useEffect(() => {
    // re-calculate language on fileName change
    setLanguage(getFileLanguage(data.displayName) ?? DEFAULT_LANGUAGE);
  }, [data.displayName]);

  if (content.error) {
    return <EmbedDefault data={data} />;
  }

  if (!content.data) {
    return <PageLoader />;
  }

  return (
    <SyntaxHighlighter language={language.key as Language} className={BASE_EMBED_CLASSES}>
      {content.data}
    </SyntaxHighlighter>
  );
};

EmbedText.embeddable = (data: Embeddable) => {
  if (data.type.startsWith('text/')) return true;
  if (getFileLanguage(data.displayName)) return true;
  if (data.size > MAX_SIZE) return false;
  return false;
};
