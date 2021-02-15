module.exports = {
  async rewrites() {
    return [
      {
        source: "/f/:fileId",
        destination: "/file/:fileId",
      },
    ];
  },
};
