import Head from "next/head";
import { EMBEDDABLE_IMAGE_TYPES } from "@micro/common";
import { GetFileData } from "@micro/api";

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

FileEmbedImage.embeddable = (type: string) => EMBEDDABLE_IMAGE_TYPES.includes(type);
