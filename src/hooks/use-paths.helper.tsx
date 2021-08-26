import { useConfig } from "./use-config.hook";
import { useHost } from "./use-host.hook";

export const usePaths = () => {
  const config = useConfig(false);
  const currentHost = useHost();
  if (!config.data?.hosts || !currentHost) {
    return {
      home: "/",
      dashboard: "/dashboard",
      login: "/login",
      loading: !config.data && !config.error,
    };
  }

  const rootHost = config.data.hosts.find((host) => host.root);
  if (!rootHost) throw new Error(`Expected root host was missing.`);
  const rootIsCurrent = currentHost.data.key === rootHost.data.key;
  return {
    home: currentHost.data.redirect ?? rootIsCurrent ? "/" : rootHost.data.url,
    dashboard: rootIsCurrent ? "/dashboard" : rootHost.data.url + "/dashboard",
    login: rootIsCurrent ? "/login" : rootHost.data.url + "/login",
    loading: false,
  };
};
