module.exports = {
  async rewrites() {
    return [
      {
        source: "/(f|file)/:fileId.:extension",
        destination: "http://localhost:8080/file/:fileId.:extension*",
      },
      {
        source: "/(t|thumbnail)/:fileId",
        destination: "http://localhost:8080/thumbnail/:fileId*",
      },
      {
        source: "/f/:fileId",
        destination: "/file/:fileId",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/:path*",
      },
    ];
  },
};
