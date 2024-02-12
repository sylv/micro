import { FC } from 'react';
import { SSRData } from '@urql/preact';

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: FC<PageProps>;
      state?: SSRData;
      pageHtml?: string;
      cookies?: string;
    }
  }
}

export type PageProps = {
  routeParams: Record<string, string | undefined>;
};

// Tell TypeScript this file isn't an ambient module
export {};
