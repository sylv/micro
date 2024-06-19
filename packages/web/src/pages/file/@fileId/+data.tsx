import type { PageContext } from "vike/types";
import { graphql } from "../../../graphql";
import { getServerClient } from "../../../renderer/useServerClient";

export const GetFile = graphql(`
    query GetFile($fileId: ID!) {
      file(fileId: $fileId) {
        id
        type
        displayName
        size
        sizeFormatted
        textContent
        isOwner
        metadata {
          height
          width
        }
        paths {
          view
          thumbnail
          direct
        }
        urls {
          view
        }
      }
    }
  `);

export const data = async (pageContext: PageContext) => {
  const client = getServerClient(pageContext);
  const { data } = await client.query(GetFile, { fileId: pageContext.routeParams!.fileId });
  return data;
};
