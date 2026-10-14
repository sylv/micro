import type { SSRExchange } from "urql";
import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import { Layout } from "./Layout";
import { Wrapper } from "./Wrapper";

const config: Config = {
  extends: [vikeReact],
  passToClient: ["state", "routeParams"],
  Wrapper: Wrapper,
  Layout: Layout,
  stream: true,
  // todo: breaks useServerClient() because it re-renders after SSR data is grabbed,
  // currently done manually in Layout.tsx
  reactStrictMode: false,
};

export default config;

declare global {
  namespace Vike {
    interface PageContext {
      ssrExchange?: SSRExchange;
    }
  }
}
