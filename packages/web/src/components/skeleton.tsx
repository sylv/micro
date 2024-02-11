import clsx from 'clsx';
import { FC, Fragment, ReactNode, memo } from 'react';
import { BASE_BUTTON_CLASSES } from './button';
import { BASE_INPUT_CLASSES, BASE_INPUT_MAX_HEIGHT } from './input/container';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = memo<SkeletonProps>(({ className }) => {
  const hasHeight = !className?.includes(' h-');
  return <div className={clsx('animate-pulse bg-gray-800 rounded-md', className, hasHeight && 'h-4')} />;
});

interface SkeletonListProps {
  count: number;
  children: ReactNode;
  className?: string;
  as?: FC | FC<{ className?: string }>;
}

export const SkeletonList = memo<SkeletonListProps>(({ count, children, className, as }) => {
  const Component = as || 'div';
  return (
    <Component className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Fragment key={i}>{children}</Fragment>
      ))}
    </Component>
  );
});

interface InputSkeletonProps {
  maxHeight?: boolean;
  className?: string;
}

export const InputSkeleton = memo<InputSkeletonProps>(({ maxHeight = true, className }) => {
  const classes = clsx(BASE_INPUT_CLASSES, maxHeight && BASE_INPUT_MAX_HEIGHT, className, 'border-transparent');
  return <Skeleton className={classes} />;
});

export const ButtonSkeleton = memo<SkeletonProps>(({ className }) => {
  return <Skeleton className={clsx(BASE_BUTTON_CLASSES, className, 'min-h-[2.65em] min-w-[20em]')} />;
});

export const SkeletonWrap = memo<{
  show: boolean;
  children: ReactNode;
}>(({ show, children }) => {
  if (!show) return children;

  return (
    <span className="relative">
      <Skeleton className="absolute inset-0 h-full" />
      <span className="opacity-0">{children}</span>
    </span>
  );
});
