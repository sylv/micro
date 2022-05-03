import { GetServerConfigData } from "@micro/api";
import useSWR from "swr";

export const useConfig = (removeInaccessibleHosts: boolean) => {
  const config = useSWR<GetServerConfigData>(`config`);
  if (config.data && removeInaccessibleHosts) {
    config.data.hosts = config.data.hosts.filter((host) => host.authorised);
  }

  return config;
};
