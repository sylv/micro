import { useConfig } from './useConfig';

export const usePaths = () => {
  const config = useConfig();
  if (!config.data) {
    return {
      home: '/',
      files: '/dashboard',
      preferences: '/dashboard/preferences',
      login: '/login',
      loading: !config.data && !config.error,
    };
  }

  const rootIsCurrent = config.data.rootHost.normalised === config.data.currentHost.normalised;
  const home = config.data.currentHost.redirect ?? rootIsCurrent ? '/' : config.data.rootHost.url;
  const files = rootIsCurrent ? '/dashboard' : config.data.rootHost.url + '/dashboard';
  const preferences = `${files}/preferences`;
  const login = rootIsCurrent ? '/login' : config.data.rootHost.url + '/login';
  return {
    home,
    files,
    login,
    preferences,
    loading: false,
  };
};
