import { useConfig } from "./use-config.hook";

export const useHost = () => {
  const config = useConfig(false);
  if (config.data) {
    for (const host of config.data.hosts) {
      const pattern = new RegExp(host.data.pattern);
      if (pattern.test(window.location.hostname)) return host;
    }
  }
};
