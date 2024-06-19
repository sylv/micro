import type { FC } from "react";
import { useData } from "vike-react/useData";
import { EmbedImage } from "../../../components/embed/variants/embed-image";
import type { data } from "./+data";

// todo: this is awful and potentially means fetching data twice + creating two urql clients
// it requires lots of code to do something very basic. but i can't find a better way with streaming+vike
// maybe forking react-streaming and add a way to wait for a trigger, but that'd require rewriting half of vike-react.
export const Head: FC = () => {
  const result = useData() as Awaited<ReturnType<typeof data>>;
  if (!result)
    return (
      <>
        <title>micro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:site_name" content="micro" />
      </>
    );

  return (
    <>
      <title>{`${result.file.displayName} — micro`}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:site_name" content="micro" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <meta name="twitter:title" content={result.file.displayName} />
      <meta property="og:title" content={result.file.displayName} key="title" />
      <meta property="og:url" content={result.file.paths.view} />
      <meta property="og:type" content="article" />
      {EmbedImage.embeddable(result.file) && (
        <>
          <meta name="twitter:image" content={result.file.paths.direct} />
          <meta property="og:image" content={result.file.paths.direct} />
        </>
      )}
    </>
  );
};
