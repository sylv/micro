import { useConfig } from "./use-config.hook";

export const usePaths = () => {
  const config = useConfig();
  if (!config.data) {
    return {
      home: "/",
      dashboard: "/dashboard",
      login: "/login",
      loading: !config.data && !config.error,
    };
  }

  const rootIsCurrent = config.data.rootHost === config.data.host.normalised;
  const home = config.data.host.redirect ?? rootIsCurrent ? "/" : config.data.rootHost.url;
  const dashboard = rootIsCurrent ? "/dashboard" : config.data.rootHost.url + "/dashboard";
  const login = rootIsCurrent ? "/login" : config.data.rootHost.url + "/login";
  return {
    home,
    dashboard,
    login,
    loading: false,
  };
};
