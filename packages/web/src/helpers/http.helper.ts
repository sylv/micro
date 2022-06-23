import { getReasonPhrase } from 'http-status-codes';

export class HTTPError extends Error {
  readonly status: number;
  readonly text: number;
  constructor(readonly response: Response, readonly body: any) {
    const message = body?.message ?? response.statusText;
    const messageText = Array.isArray(message) ? message.join(', ') : message;
    const responseText = getReasonPhrase(response.status);
    super(`${responseText}: ${messageText}`);
    this.status = response.status;
    this.text = message;
    this.name = 'HTTPError';
  }
}

export async function http(pathOrUrl: string, options?: RequestInit): Promise<Response> {
  const isServer = typeof window === 'undefined';
  let url: string;
  if (isServer && !pathOrUrl.startsWith('http')) {
    const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    url = `${process.env.API_URL}${path}`;
  } else {
    url = pathOrUrl.startsWith('http') || pathOrUrl.startsWith('/') ? pathOrUrl : `/api/${pathOrUrl}`;
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const clone = response.clone();
    const body = await clone.json().catch(() => null);
    throw new HTTPError(response, body);
  }

  return response;
}
