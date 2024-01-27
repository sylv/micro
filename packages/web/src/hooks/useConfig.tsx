import { useQuery } from '@apollo/client';
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
  const config = useQuery(ConfigQuery);
  return {
    ...config,
    data: config.data?.config,
  };
};
