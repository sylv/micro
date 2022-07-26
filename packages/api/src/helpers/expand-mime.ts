const WILDCARD_REGEX = /\/\*$/gu;
const MIME_MAP = new Map<string, string[]>([
  [
    'video',
    [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/x-ms-wmv',
      'video/x-msvideo',
      'video/x-flv',
      'video/x-matroska',
      'video/3gpp',
      'video/3gpp2',
    ],
  ],
  ['image', ['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/webp']],
  [
    'audio',
    [
      'audio/aac',
      'audio/aacp',
      'audio/amr',
      'audio/amr-wb',
      'audio/basic',
      'audio/flac',
      'audio/midi',
      'audio/mp3',
      'audio/mpeg',
      'audio/mpeg3',
      'audio/ogg',
      'audio/opus',
      'audio/wav',
      'audio/webm',
    ],
  ],
]);

export const expandMime = (input: string | string[]) => {
  if (!Array.isArray(input)) input = [input];
  const output: string[] = [];
  for (const mimeType of input) {
    const alias = MIME_MAP.get(mimeType.replace(WILDCARD_REGEX, ''));
    if (alias) {
      output.push(...alias);
      continue;
    }

    if (!mimeType.includes('/')) {
      throw new Error(`Unknown mime category "${mimeType}"`);
    }

    output.push(mimeType);
  }

  return output;
};
