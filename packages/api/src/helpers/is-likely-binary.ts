const prefixes = ['image/', 'video/', 'audio/'];

export const isLikelyBinary = (mimeType: string) => {
  if (mimeType === 'application/octet-stream') return true;
  const hasPrefix = prefixes.some((prefix) => mimeType.startsWith(prefix));
  if (hasPrefix) return true;
  return false;
};
