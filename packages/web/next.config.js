module.exports = {
  async rewrites() {
    return [
      {
        source: '/t/:thumbnailId',
        destination: 'http://localhost:8080/thumbnail/:thumbnailId/content',
      },
      {
        source: '/(f|file)/:fileId.:extension',
        destination: 'http://localhost:8080/file/:fileId/content',
      },
      {
        source: '/f/:fileId/delete',
        destination: 'http://localhost:8080/file/:fileId/delete',
      },
      {
        source: '/f/:fileId',
        destination: '/file/:fileId',
      },
      {
        source: '/(p|paste)/:pasteId.:extension',
        destination: 'http://localhost:8080/paste/:pasteId/content',
      },
      {
        source: '/(l|s|link)/:linkId',
        destination: 'http://localhost:8080/link/:linkId/go',
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
