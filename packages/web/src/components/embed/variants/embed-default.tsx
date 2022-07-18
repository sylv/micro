import classNames from 'classnames';
import { BASE_EMBED_CLASSES } from '../embed';
import type { Embeddable } from '../embeddable';

export const EmbedDefault = ({ data }: { data: Embeddable }) => {
  const classes = classNames('flex flex-col items-center justify-center w-full select-none h-44', BASE_EMBED_CLASSES);
  return (
    <div className={classes}>
      <h1 className="flex items-center mb-2 text-xl font-bold">{data.type}</h1>
      <span className="text-sm text-gray-500">No preview available for this file type.</span>
    </div>
  );
};