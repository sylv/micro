import { http } from "./http";

export async function downloadUrl(url: string, name: string = ""): Promise<void> {
  if (url.startsWith("blob") || url.includes(window.location.hostname) || url.startsWith("/")) {
    // this only works on same-origin urls
    var link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    return;
  }

  console.log(`Downloading cross-origin file "${url}"`);
  const response = await http(url);
  const blob = await response.blob();
  return downloadUrl(URL.createObjectURL(blob), name);
}
