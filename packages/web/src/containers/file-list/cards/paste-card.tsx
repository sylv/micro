import clsx from "clsx";
import { Time } from "../../../components/time";
import { useUser } from "../../../hooks/useUser";
import type { FC } from "react";
import type { FragmentOf } from "gql.tada";
import { graphql, unmask } from "../../../graphql";

export const PasteCardFrag = graphql(`
  fragment PasteCard on Paste {
    id
    title
    encrypted
    burn
    type
    createdAt
    expiresAt
    urls {
      view
    }
  }
`);

interface PasteCardProps {
  paste: FragmentOf<typeof PasteCardFrag>;
}

export const PasteCard: FC<PasteCardProps> = ({ paste: _paste }) => {
  const paste = unmask(PasteCardFrag, _paste);
  const user = useUser();
  const showUrl = !paste.encrypted && user.data;
  const url = showUrl
    ? paste.burn
      ? `${paste.urls.view}?burn_unless=${user.data.id}`
      : paste.urls.view
    : "#";
  const containerClasses = clsx(!showUrl && "cursor-not-allowed");
  const modifiers: string[] = [paste.type];
  if (paste.burn) modifiers.push("burn");
  if (paste.encrypted) modifiers.push("encrypted");
  const tooltip = showUrl
    ? undefined
    : "This paste cannot be viewed because it is encrypted or will be destroyed on next view.";

  return (
    <a href={url} className={containerClasses} title={tooltip}>
      <div className="h-full flex transition-colors rounded-lg shadow bg-dark-200 hover:bg-dark-400 group overflow-hidden p-3 justify-between">
        <div>
          <div className="text-sm text-gray-500">{modifiers.join(", ")}</div>
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
    </a>
  );
};
