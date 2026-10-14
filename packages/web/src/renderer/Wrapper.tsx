import type { ReactNode } from "react";
import { Provider as UrqlProvider, type Client } from "urql";
import { useClientClient } from "./useClientClient";
import { useServerClient } from "./useServerClient";

export const Wrapper = ({ children }: { children: ReactNode }) => {
  let client: Client;
  if (typeof window === "undefined") {
    client = useServerClient();
  } else {
    client = useClientClient();
  }

  return <UrqlProvider value={client}>{children}</UrqlProvider>;
};
