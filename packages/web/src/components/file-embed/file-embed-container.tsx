import { GetFileData } from "@micro/api";
import classNames from "classnames";
import Head from "next/head";
import { FC, ReactNode } from "react";

export const FileEmbedContainer: FC<{ file: GetFileData; children: ReactNode; className?: string }> = ({
  file,
  children,
  className,
}) => {
  const classes = classNames(
    "flex items-center justify-center col-span-5 rounded shadow-2xl bg-dark-200 max-h-[75vh] min-h-[3em]",
    className
  );

  return (
    <div className={classes}>
      <Head>
        <meta name="twitter:title" content={file.displayName} />
        <meta property="og:title" content={file.displayName} key="title" />
        <meta property="og:url" content={file.paths.view} />
        <meta property="og:type" content="article" />
      </Head>
      {children}
    </div>
  );
};
