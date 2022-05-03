import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import { FC, useMemo } from "react";

dayjs.extend(RelativeTime);

export interface TimeProps {
  date: string | number | Date;
  className?: string;
}

export const Time: FC<TimeProps> = (props) => {
  const date = useMemo(() => new Date(props.date), [props.date]);
  const relative = useMemo(() => dayjs().to(date), [date]);
  const iso = date.toISOString();

  return (
    <time dateTime={iso} className={props.className}>
      {relative}
    </time>
  );
};
