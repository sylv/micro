module.exports = {
  future: {
    webpack5: true,
  },
  async rewrites() {
    return [
      {
        source: "/f/:fileId",
        destination: "/file/:fileId",
      },
    ];
  },
};
