import { downloadUrl } from "./downloadUrl";
export function downloadFile(name: string, content: string) {
  const file = new Blob([content], { type: "text/plain" });
  return downloadUrl(URL.createObjectURL(file), name);
}
