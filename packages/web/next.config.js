/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  eslint: {
    // todo: eslint is broken with typescript 5.2 and every file errors out,
    // this is temporary to get it to build with eslint broken.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        // legacy compatibility, redirect old /file/:id/delete?key=x to /file/:id?deleteKey=x
        // unfortunately ?key will still be included, there is apparently no way to rename the query param,
        // only add a new param with the same value.
        source: '/:type(f|v|i|file)/:fileId/delete',
        has: [
          {
            type: 'query',
            key: 'key',
          },
        ],
        destination: '/:type/:fileId?deleteKey=:key',
        permanent: false,
      },
    ];
  },
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
        source: '/(p|paste)/:pasteId.:extension',
        destination: 'http://localhost:8080/paste/:pasteId',
      },
      {
        source: '/(l|s|link)/:linkId',
        destination: 'http://localhost:8080/link/:linkId',
      },
      {
        source: '/(f|v|i)/:fileId',
        destination: '/file/:fileId',
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
