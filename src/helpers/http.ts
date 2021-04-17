import { getReasonPhrase } from "http-status-codes";

export async function http(...args: Parameters<typeof fetch>) {
  const response = await fetch(...args);
  if (!response.ok) {
    const clone = response.clone();
    const body = await clone.json().catch(() => null);
    const message = body?.message ?? response.statusText;
    const messageText = Array.isArray(message) ? message.join(", ") : message;
    const responseText = getReasonPhrase(response.status);
    const error: any = new Error(`${responseText}: ${messageText}`);
    error.status = response.status;
    error.text = message;
    throw error;
  }

  return response;
}
