import { getReasonPhrase } from 'http-status-codes';

export class HTTPError extends Error {
  readonly status: number;
  readonly text: string;
  constructor(
    readonly response: Response,
    readonly body: any,
  ) {
    const message = body?.message ?? response.statusText;
    const messageText = Array.isArray(message) ? message.join(', ') : message;
    const responseText = getReasonPhrase(response.status);
    super(`${responseText}: ${messageText}`);
    this.status = response.status;
    this.text = message;
    this.name = 'HTTPError';
  }
}

export const isServer = typeof window === 'undefined';
export const apiUri = isServer ? process.env.FRONTEND_API_URL : `/api`;

export async function http(pathOrUrl: string, options?: RequestInit): Promise<Response> {
  const hasProtocol = pathOrUrl.startsWith('http');
  const isAbsolute = pathOrUrl.startsWith('/');
  const url = hasProtocol || isAbsolute ? pathOrUrl : `${apiUri}${isAbsolute ? '' : '/'}${pathOrUrl}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    const clone = response.clone();
    const body = await clone.json().catch(() => null);
    throw new HTTPError(response, body);
  }

  return response;
}
