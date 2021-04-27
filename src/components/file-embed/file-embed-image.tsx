import Head from "next/head";
import { EMBEDDABLE_IMAGE_TYPES } from "../../constants";
import { GetFileData } from "../../types";

export const FileEmbedImage = ({ file }: { file: GetFileData }) => {
  return (
    <>
      <Head>
        <meta name="twitter:image" content={file.urls.direct} />
        <meta property="og:image" content={file.urls.direct} />
      </Head>
      <img className="h-full" src={file.urls.direct} alt={file.displayName} />
    </>
  );
};

FileEmbedImage.embeddable = (type: string) => EMBEDDABLE_IMAGE_TYPES.includes(type);
