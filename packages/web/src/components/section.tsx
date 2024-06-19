import type { FC, ReactNode } from "react";

export const Section: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => {
  return (
    <div className="relative py-8">
      <section className={className}>{children}</section>
      <div className="top-0 bottom-0 absolute w-[500vw] -left-full h-full bg-black shadow-lg -z-10" />
    </div>
  );
};
