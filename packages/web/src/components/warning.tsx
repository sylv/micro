import clsx from 'clsx';
import { useMemo, type FC, type ReactNode } from 'react';
import { FiInfo, FiXOctagon } from 'react-icons/fi';

export enum WarningType {
  Info = 'bg-purple-400 border-purple-400',
  Error = 'bg-red-500 border-red-500',
}

export const Warning: FC<{ children: ReactNode; type?: WarningType; className?: string }> = ({
  children,
  type = WarningType.Info,
  className,
}) => {
  const classes = clsx('bg-opacity-40 border px-2 py-1 rounded text-sm flex items-center gap-2', className, type);
  const icon = useMemo(() => {
    switch (type) {
      case WarningType.Error: {
        return <FiXOctagon className="text-red-400 h-5 w-5" />;
      }
      case WarningType.Info: {
        return <FiInfo className="text-purple-400 h-5 w-5" />;
      }
    }
  }, [type]);

  return (
    <div className={classes} role="alert">
      {icon}
      {children}
    </div>
  );
};
