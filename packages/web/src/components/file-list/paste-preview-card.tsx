import type { GetPasteData } from '@ryanke/micro-api';
import classNames from 'classnames';
import { memo } from 'react';
import { Link } from '../link';
import { Time } from '../time';

export interface PasteCardProps {
  paste: GetPasteData;
}

export const PastePreviewCard = memo<PasteCardProps>(({ paste }) => {
  const showUrl = !paste.encrypted && !paste.burn;
  const url = showUrl ? paste.urls.view : '#';
  const containerClasses = classNames(!showUrl && 'cursor-not-allowed');
  const modifiers: string[] = [paste.type];
  if (paste.burn) modifiers.push('burn');
  if (paste.encrypted) modifiers.push('encrypted');
  const tooltip = showUrl
    ? undefined
    : 'This paste cannot be viewed because it is encrypted or will be destroyed on next view.';

  return (
    <Link href={url} className={containerClasses} title={tooltip}>
      <div className="h-full flex transition-colors rounded-lg shadow bg-dark-200 hover:bg-dark-400 group overflow-hidden p-3 justify-between">
        <div>
          <div className="text-sm text-gray-500">{modifiers.join(', ')}</div>
          <div className="">{paste.title || `Unnamed paste ${paste.id}`}</div>
        </div>
        <div className="flex flex-col gap-1 items-end text-right text-sm text-gray-600">
          <div className="flex items-center gap-1">
            created <Time date={paste.createdAt} />
          </div>
          {paste.expiresAt && (
            <div className="flex items-center gap-1">
              expires <Time date={paste.expiresAt} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
});
