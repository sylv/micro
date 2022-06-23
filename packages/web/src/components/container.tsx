import classNames from 'classnames';
import type { FC, ReactNode } from 'react';

export interface ContainerProps {
  centerX?: boolean;
  centerY?: boolean;
  center?: boolean;
  small?: boolean;
  className?: string;
  children: ReactNode;
}

export const Container: FC<ContainerProps> = (props) => {
  const centerX = props.centerX ?? props.center;
  const centerY = props.centerY ?? props.center;
  const center = centerX ?? centerY;
  const classes = classNames(props.className, 'px-4 mx-auto', {
    'sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl': !props.small,
    'flex justify-center flex-col': center,
    'absolute top-16 bottom-0 right-0 left-0': centerY,
    'items-center': centerX,
    'max-w-xs': props.small,
  });

  return <div className={classes}>{props.children}</div>;
};
