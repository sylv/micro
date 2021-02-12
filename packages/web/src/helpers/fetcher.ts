export async function fetcher(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    const error: any = new Error(`${response.status}: ${response.statusText}`);
    error.status = response.status;
    error.text = response.statusText;
    throw error;
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}
