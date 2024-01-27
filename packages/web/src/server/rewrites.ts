export const REWRITES = [
  {
    source: '/t/:thumbnailId',
    destination: '/api/thumbnail/:thumbnailId',
  },
  {
    source: '/(f|v|i)/:fileId.:extension',
    destination: '/api/file/:fileId',
  },
  {
    source: '/(p|paste)/:pasteId.:extension',
    destination: '/api/paste/:pasteId',
  },
  {
    source: '/(l|s|link)/:linkId',
    destination: '/api/link/:linkId',
  },
  {
    source: '/(f|v|i)/:fileId',
    destination: '/file/:fileId',
  },
  {
    source: '/p/:pasteId',
    destination: '/paste/:pasteId',
  },
];
