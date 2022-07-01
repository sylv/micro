/* eslint-disable react/no-danger */
import classNames from 'classnames';
import * as avatar from 'generate-avatar';
import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';

export interface AvatarProps {
  userId: string;
  className?: string;
}

export const Avatar: FC<AvatarProps> = (props) => {
  const classes = classNames('overflow-hidden rounded-full select-none', props.className);
  const containerRef = useRef<HTMLDivElement>(null);
  const svg = useMemo(() => {
    return avatar.generateFromString(props.userId);
  }, [props.userId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.firstElementChild?.setAttribute('height', 'inherit');
      containerRef.current.firstElementChild?.setAttribute('width', 'inherit');
    }
  }, [containerRef]);

  return <div className={classes} dangerouslySetInnerHTML={{ __html: svg }} ref={containerRef} />;
};
