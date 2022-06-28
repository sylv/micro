import type { GetServerSidePropsContext } from 'next';
import { http } from './http.helper';

export interface FetcherOptions {
  headers?: Record<string, string | undefined>;
  context?: GetServerSidePropsContext;
}

export async function fetcher<T = unknown>(url: string, options?: FetcherOptions): Promise<T> {
  const headers = options?.headers ?? {};
  if (options?.context) {
    const incomingHeaders = options.context.req.headers;
    // for host matching we have to forward the host header
    if (incomingHeaders['user-agent']) headers['User-Agent'] = incomingHeaders['user-agent'];
    if (incomingHeaders.host) headers['x-forwarded-host'] = incomingHeaders.host;
  }

  const response = await http(url, { headers: headers as any });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text as unknown as T;
  }
}
