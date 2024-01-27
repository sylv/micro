import type { Language } from 'prism-react-renderer';
import { useEffect, useState } from 'react';
import { getFileLanguage } from '../../../helpers/get-file-language.helper';
import { SyntaxHighlighter } from '../../syntax-highlighter/syntax-highlighter';
import { BASE_EMBED_CLASSES } from '../embed';
import type { Embeddable } from '../embeddable';

const DEFAULT_LANGUAGE = getFileLanguage('diff')!;
const MAX_SIZE = 1_000_000; // 1mb

export const EmbedText = ({ data }: { data: Embeddable }) => {
  const [language, setLanguage] = useState(getFileLanguage(data.displayName) ?? DEFAULT_LANGUAGE);

  useEffect(() => {
    // re-calculate language on fileName change
    setLanguage(getFileLanguage(data.displayName) ?? DEFAULT_LANGUAGE);
  }, [data.displayName]);

  if (!data.textContent) {
    throw new Error('EmbedText requires textContent');
  }

  return (
    <SyntaxHighlighter language={language.key as Language} className={BASE_EMBED_CLASSES}>
      {data.textContent}
    </SyntaxHighlighter>
  );
};

EmbedText.embeddable = (data: Embeddable) => {
  if (data.size > MAX_SIZE) return false;
  if (data.textContent) return true;
  return false;
};
