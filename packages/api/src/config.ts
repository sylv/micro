import rc from "rc";

export interface MicroConfig {
  /** path to the config path, if any */
  host: string;
  secret: string;
  domains: string[];
  uploadLimit: number;
  allowTypes?: string[];
  database: {
    uri: string;
    synchronize: boolean;
  };
}

export const config = rc("micro", {
  uploadLimit: 50000000,
}) as MicroConfig;
