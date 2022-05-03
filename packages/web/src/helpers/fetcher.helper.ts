import { http } from "./http.helper";

export async function fetcher<T = unknown>(url: string): Promise<T> {
  const response = await http(url);
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text as unknown as T;
  }
}
