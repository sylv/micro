import { http } from "./http.helper";

export async function fetcher(url: string): Promise<string | Record<string, unknown>> {
  const response = await http(url);
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
