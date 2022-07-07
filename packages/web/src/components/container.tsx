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

export const Container: FC<ContainerProps> = ({
  center,
  centerX = center,
  centerY = center,
  className,
  small,
  children,
}) => {
  const classes = classNames(className, 'px-4 mx-auto', {
    'sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl': !small,
    'flex justify-center flex-col': centerX || centerY,
    'absolute top-16 bottom-0 right-0 left-0': centerY,
    'items-center': centerX,
    'max-w-xs': small,
  });

  return <div className={classes}>{children}</div>;
};
