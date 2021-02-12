module.exports = {
  async rewrites() {
    return [
      {
        source: "/f/:fileId",
        destination: "/file/:fileId",
      },
      {
        source: "/i/:fileId",
        destination: "/file/:fileId",
      },
      {
        source: "/image/:fileId",
        destination: "/file/:fileId",
      },
    ];
  },
};
