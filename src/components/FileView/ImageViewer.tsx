import Head from "next/head";
import { EMBEDDABLE_IMAGE_TYPES } from "src/constants";
import { GetFileData } from "../../types";

export function checkImageSupport(file: GetFileData) {
  return EMBEDDABLE_IMAGE_TYPES.includes(file.type);
}

export const ImageViewer = (props: { file: GetFileData }) => {
  return (
    <>
      <Head>
        <meta name="twitter:image" content={props.file.urls.direct} />
        <meta property="og:image" content={props.file.urls.direct} />
      </Head>
      <img src={props.file.urls.direct} alt={props.file.displayName} />
    </>
  );
};
