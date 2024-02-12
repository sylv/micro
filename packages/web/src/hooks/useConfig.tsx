import { CombinedError, useQuery } from '@urql/preact';
import { graphql } from '../@generated';

const ConfigQuery = graphql(`
  query Config {
    config {
      allowTypes
      inquiriesEmail
      requireEmails
      uploadLimit
      currentHost {
        normalised
        redirect
      }
      rootHost {
        normalised
        url
      }
      hosts {
        normalised
      }
    }
  }
`);

export const useConfig = () => {
  const [config] = useQuery({ query: ConfigQuery });
  return {
    error: config.error as CombinedError | undefined,
    data: config.data?.config,
  };
};
