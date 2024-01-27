import { NormalizedCacheObject } from '@apollo/client';
import { FC } from 'react';

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: FC<PageProps>;
      state?: NormalizedCacheObject;
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
