import clsx from 'clsx';
import { Markdown } from '../../markdown';
import { BASE_EMBED_CLASSES } from '../embed';
import type { Embeddable } from '../embeddable';

export const EmbedMarkdown = ({ data }: { data: Embeddable }) => {
  const classes = clsx('p-4', BASE_EMBED_CLASSES);

  if (!data.textContent) {
    throw new Error('EmbedText requires textContent');
  }

  return <Markdown className={classes}>{data.textContent}</Markdown>;
};

const MAX_MARKDOWN_SIZE = 1_000_000; // 1mb
EmbedMarkdown.embeddable = (data: Embeddable) => {
  if (data.size > MAX_MARKDOWN_SIZE) return false;
  if (!data.textContent) return false;
  if (data.type === 'text/markdown') return true;
  if (data.type === 'text/plain' && data.displayName?.endsWith('md')) return true;
  return false;
};
