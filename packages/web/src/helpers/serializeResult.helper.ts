import type { OperationResult, SerializedResult } from "urql";

// https://github.com/urql-graphql/urql/blob/1bb05f58d91fee9c20368bd808c4832ead318179/packages/core/src/exchanges/ssr.ts#L107
export const serializeResult = (result: OperationResult, includeExtensions: boolean): SerializedResult => {
  const serialized: SerializedResult = {
    data: JSON.stringify(result.data),
    hasNext: result.hasNext,
  };

  if (result.data !== undefined) {
    serialized.data = JSON.stringify(result.data);
  }

  if (includeExtensions && result.extensions !== undefined) {
    serialized.extensions = JSON.stringify(result.extensions);
  }

  if (result.error) {
    serialized.error = {
      graphQLErrors: result.error.graphQLErrors.map((error) => {
        if (!error.path && !error.extensions) return error.message;

        return {
          message: error.message,
          path: error.path,
          extensions: error.extensions,
        };
      }),
    };

    if (result.error.networkError) {
      serialized.error.networkError = "" + result.error.networkError;
    }
  }

  return serialized;
};
