import { PageContext, RouteSync } from 'vike/types';
import { resolveRoute } from 'vike/routing';

const PATTERN = /^\/(file|f|v|i)\//;

export const route: RouteSync = (pageContext: PageContext) => {
  if (PATTERN.test(pageContext.urlPathname)) {
    const replaced = pageContext.urlPathname.replace(PATTERN, '/file/');
    return resolveRoute('/file/@fileId', replaced);
  }

  return false;
};
