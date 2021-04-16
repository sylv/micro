import { useConfig } from "./useConfig";
import { useHost } from "./useHost";

export const usePaths = () => {
  const config = useConfig(false);
  const currentHost = useHost();
  if (!config.data?.hosts || !currentHost) {
    return {
      home: "/",
      dashboard: "/dashboard",
      loading: !config.data && !config.error,
    };
  }

  const rootHost = config.data.hosts.find((host) => host.root)!;
  const rootIsCurrent = currentHost.data.key === rootHost.data.key;
  return {
    home: currentHost.data.redirect ?? rootIsCurrent ? "/" : rootHost.data.url,
    dashboard: rootIsCurrent ? "/dashboard" : rootHost.data.url + "/dashboard",
    login: rootIsCurrent ? "/login" : rootHost.data.url + "/login",
    loading: false,
  };
};
