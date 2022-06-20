import { http } from "../../helpers/http.helper";

export const textFetcher = async (url: string) => {
  const response = await http(url);
  return response.text();
};
