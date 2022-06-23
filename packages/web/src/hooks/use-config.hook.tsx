import { GetServerConfigData } from '@ryanke/micro-api';
import useSWR from 'swr';

export const useConfig = () => {
  return useSWR<GetServerConfigData>(`config`);
};
