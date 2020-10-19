import axios from "axios";
import { getToken } from "./hooks/useUser";

export async function fetcher(url: string) {
  const response = await axios.get(url, {
    headers: {
      Authorization: getToken(),
    },
  });

  return response.data;
}
