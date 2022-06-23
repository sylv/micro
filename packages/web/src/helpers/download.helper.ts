import { http } from './http.helper';

export async function downloadUrl(url: string, name = ''): Promise<void> {
  if (url.startsWith('blob') || url.includes(window.location.hostname) || url.startsWith('/')) {
    // this only works on same-origin urls
    const link = document.createElement('a');
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

export function downloadFile(name: string, content: string): Promise<void> {
  const file = new Blob([content], { type: 'text/plain' });
  return downloadUrl(URL.createObjectURL(file), name);
}
