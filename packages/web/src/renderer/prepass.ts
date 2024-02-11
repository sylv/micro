import { VNode } from 'preact';
import renderToString from 'preact-render-to-string';
import { Client } from 'urql';

const MAX_DEPTH = 3;
const isPromiseLike = (value: unknown): value is Promise<unknown> => {
  if (value && typeof (value as Promise<unknown>).then === 'function') return true;
  return false;
};

/**
 * Enables urql suspense, then re-renders the tree until there are no suspense errors.
 * This is a hack workaround because both `react-ssr-prepass` and `preact-ssr-prepass` are not working, both have preact/react compat errors.
 */
export const renderToStringWithData = async (client: Client, tree: VNode, depth = 0): Promise<string> => {
  try {
    client.suspense = true;
    const result = renderToString(tree);
    client.suspense = false;
    return result;
  } catch (error) {
    if (isPromiseLike(error)) {
      if (depth > MAX_DEPTH) {
        throw new Error(
          `Exceeded max suspense depth. Try merge your queries so there are not ${MAX_DEPTH}+ on a single page.`,
        );
      }

      await error;
      return renderToStringWithData(client, tree, depth++);
    }

    throw error;
  }
};
