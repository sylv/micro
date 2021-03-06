import Head from "next/head";
import { FunctionComponent } from "react";
import { GetFileData } from "../../types";

export const FileEmbedContainer: FunctionComponent<{ file: GetFileData; children: React.ReactChild }> = (props) => {
  return (
    <div className="flex items-center justify-center col-span-5 rounded shadow-2xl bg-dark-200 max-h-[75vh] min-h-[3em]">
      <Head>
        <meta name="twitter:title" content={props.file.displayName} />
        <meta property="og:title" content={props.file.displayName} key="title" />
        <meta property="og:url" content={props.file.urls.view} />
        <meta property="og:type" content="article" />
      </Head>
      {props.children}
    </div>
  );
};
