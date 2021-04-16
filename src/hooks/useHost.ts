import { useConfig } from "./useConfig";

export const useHost = () => {
  const config = useConfig(false);
  if (config.data) {
    for (const host of config.data.hosts) {
      const pattern = new RegExp(host.data.pattern);
      if (pattern) return host;
    }
  }
};
