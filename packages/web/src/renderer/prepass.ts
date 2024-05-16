import type { VNode } from "preact";
import renderToString, { renderToStringAsync } from "preact-render-to-string";
import type { Client } from "@urql/preact";

const MAX_DEPTH = 3;
const isPromiseLike = (value: unknown): value is Promise<unknown> => {
  if (value && typeof (value as Promise<unknown>).then === "function") return true;
  return false;
};

/**
 * Enables urql suspense, then re-renders the tree until there are no suspense errors.
 */
export const renderToStringWithData = async (client: Client, tree: VNode, depth = 0): Promise<string> => {
  // todo: this should use preact-ssr-prepass, but that has issues with `useId()` and radix.
  // i have absolutely no clue what that issue is, i can't find anything online and it's too vague
  // to debug. whatever, apollo did it this way and it worked fine. so whatever. i didn't want performance anyway.
  try {
    client.suspense = true;
    const result = await renderToStringAsync(tree);
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
