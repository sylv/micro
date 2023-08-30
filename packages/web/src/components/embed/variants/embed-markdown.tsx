import useSWR from 'swr';
import { Markdown } from '../../markdown';
import { PageLoader } from '../../page-loader';
import { EmbedDefault } from './embed-default';
import type { Embeddable } from '../embeddable';
import { textFetcher } from '../text-fetcher';
import clsx from 'clsx';
import { BASE_EMBED_CLASSES } from '../embed';

export const EmbedMarkdown = ({ data }: { data: Embeddable }) => {
  const swrContent = useSWR<string>(data.content ? null : data.paths.direct, { fetcher: textFetcher });
  const content = data.content ?? swrContent;
  const classes = clsx('p-4', BASE_EMBED_CLASSES);

  if (content.error) {
    return <EmbedDefault data={data} />;
  }

  if (!content.data) {
    return <PageLoader />;
  }

  return <Markdown className={classes}>{content.data}</Markdown>;
};

const MAX_MARKDOWN_SIZE = 1_000_000; // 1mb
EmbedMarkdown.embeddable = (data: Embeddable) => {
  if (data.size > MAX_MARKDOWN_SIZE) return false;
  if (data.type === 'text/markdown') return true;
  if (data.type === 'text/plain' && data.displayName?.endsWith('md')) return true;
  return false;
};
