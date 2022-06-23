import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import type { FC } from 'react';
import { useMemo } from 'react';

dayjs.extend(RelativeTime);
const TIMESTAMP_REGEX = /^\d{6,}$/u;

export interface TimeProps {
  date: string | number | Date;
  className?: string;
}

export const Time: FC<TimeProps> = (props) => {
  const date = useMemo(() => {
    if (typeof props.date === 'string' && TIMESTAMP_REGEX.test(props.date)) return new Date(Number(props.date));
    return new Date(props.date);
  }, [props.date]);
  const relative = useMemo(() => dayjs().to(date), [date]);
  const iso = date.toISOString();

  return (
    <time dateTime={iso} className={props.className}>
      {relative}
    </time>
  );
};
