import { GetServerSidePropsContext } from 'next';
import { http } from './http.helper';

export async function fetcher<T = unknown>(url: string, context?: GetServerSidePropsContext): Promise<T> {
  const headers: Record<string, string> = {};
  if (context) {
    // for host matching we have to forward the host header
    if (context.req.headers['user-agent']) headers['User-Agent'] = context.req.headers['user-agent'];
    if (context.req.headers['host']) headers['x-forwarded-host'] = context.req.headers['host'];
  }

  const response = await http(url, { headers });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text as unknown as T;
  }
}
