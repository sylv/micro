import { getReasonPhrase } from "http-status-codes";

export class HTTPError extends Error {
  readonly status: number;
  readonly text: number;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  constructor(readonly response: Response, readonly body: any) {
    const message = body?.message ?? response.statusText;
    const messageText = Array.isArray(message) ? message.join(", ") : message;
    const responseText = getReasonPhrase(response.status);
    super(`${responseText}: ${messageText}`);
    this.status = response.status;
    this.text = message;
  }
}

export async function http(...args: Parameters<typeof fetch>): Promise<Response> {
  const response = await fetch(...args);
  if (!response.ok) {
    const clone = response.clone();
    const body = await clone.json().catch(() => null);
    throw new HTTPError(response, body);
  }

  return response;
}
