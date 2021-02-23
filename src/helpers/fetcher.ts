import { http } from "./http";

export async function fetcher(url: string) {
  const response = await http(url);
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}
