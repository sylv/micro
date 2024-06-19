import { initGraphQLTada } from "gql.tada";
import type { introspection } from "./graphql-gen.d.ts";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment as unmask } from "gql.tada";
