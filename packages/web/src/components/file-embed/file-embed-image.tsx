import { GetFileData } from "@micro/api";
import Head from "next/head";

export const FileEmbedImage = ({ file }: { file: GetFileData }) => {
  return (
    <>
      <Head>
        <meta name="twitter:image" content={file.urls.direct} />
        <meta property="og:image" content={file.urls.direct} />
      </Head>
      <img className="object-contain h-full" src={file.urls.direct} alt={file.displayName} />
    </>
  );
};
