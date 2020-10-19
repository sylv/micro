import { TOKEN_KEY } from "./constants";

export async function request<T>(url: string, options: RequestInit): Promise<T> {
  // await new Promise((resolve) => setTimeout(resolve, 400));
  if (!options.headers) options.headers = {};
  if (options.body) options.headers["Content-Type"] = "application/json";
  return fetch(url, options).then(async (response) => {
    const body = (await response.json()) as any;
    if (response.status < 200 || response.status > 299) {
      const message = body.message || response.statusText;
      const error = new Error(message);
      (error as any).status = response.status;
      throw error;
    }

    return body;
  });
}

export async function fetcher<T>(url: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const token = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    const formattedToken = `Bearer ${token}`;
    return await request<T>(url, { headers: { Authorization: formattedToken } });
  }

  const error = new Error("Not Authorized");
  (error as any).status = 403;
  throw error;
}
