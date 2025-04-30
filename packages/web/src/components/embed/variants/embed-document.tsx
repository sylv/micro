import clsx from "clsx";
import { BASE_EMBED_CLASSES, MAX_HEIGHT } from "../embed";
import type { Embeddable } from "../embeddable";

export const EmbedDocument = ({ file }: { file: Embeddable }) => {
  const classes = clsx("outline-none h-[70vh] p-4", BASE_EMBED_CLASSES, MAX_HEIGHT);

  return (
    <object data={file.paths.direct} type="application/pdf" aria-label={file.displayName} className={classes}>
      This browser does not support PDFs. You can download the file{" "}
      <a className="text-primary" href={file.paths.direct} target="_blank" rel="noreferrer">
        here
      </a>
      .
    </object>
  );
};

EmbedDocument.embeddable = (data: Embeddable) => {
  switch (data.type) {
    case "application/pdf": {
      return true;
    }
    default: {
      return false;
    }
  }
};
