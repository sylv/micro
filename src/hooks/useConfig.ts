import useSWR from "swr";
import { Endpoints } from "../constants";
import { GetServerConfigData } from "../types";

export const useConfig = (removeInaccessibleHosts: boolean, initialData?: GetServerConfigData | undefined) => {
  const config = useSWR<GetServerConfigData>(Endpoints.CONFIG, { initialData });
  if (config.data && removeInaccessibleHosts) {
    config.data.hosts = config.data.hosts.filter((host) => host.authorised);
  }

  return config;
};
