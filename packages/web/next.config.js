module.exports = {
  async rewrites() {
    return [
      {
        source: '/t/:thumbnailId',
        destination: 'http://localhost:8080/thumbnail/:thumbnailId',
      },
      {
        source: '/(f|v|i)/:fileId.:extension',
        destination: 'http://localhost:8080/file/:fileId',
      },
      {
        source: '/(f|v|i)/:fileId/delete',
        destination: 'http://localhost:8080/file/:fileId/delete',
      },
      {
        source: '/(f|v|i)/:fileId',
        destination: '/file/:fileId',
      },
      {
        source: '/(p|paste)/:pasteId.:extension',
        destination: 'http://localhost:8080/paste/:pasteId',
      },
      {
        source: '/(l|s|link)/:linkId',
        destination: 'http://localhost:8080/link/:linkId',
      },
      {
        source: '/p/:pasteId',
        destination: '/paste/:pasteId',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ];
  },
};
