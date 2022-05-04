import { GetServerConfigData } from "@micro/api";
import useSWR from "swr";

export const useConfig = () => {
  return useSWR<GetServerConfigData>(`config`);
};
