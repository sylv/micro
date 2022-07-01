import { useConfigQuery } from '../generated/graphql';

export const useConfig = () => {
  const config = useConfigQuery();
  return {
    ...config,
    data: config.data?.config,
  };
};
