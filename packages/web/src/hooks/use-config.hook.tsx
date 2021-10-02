import useSWR from "swr";
import { Endpoints } from "@micro/common";
import { GetServerConfigData } from "@micro/api";

export const useConfig = (removeInaccessibleHosts: boolean) => {
  const config = useSWR<GetServerConfigData>(Endpoints.CONFIG);
  if (config.data && removeInaccessibleHosts) {
    config.data.hosts = config.data.hosts.filter((host) => host.authorised);
  }

  return config;
};
