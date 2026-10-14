export const REWRITES = [
  { source: "/t/:thumbnailId", destination: "/api/thumbnail/:thumbnailId" },
  ...["f", "v", "i"].map((prefix) => ({
    source: `/${prefix}/:fileId.:extension`,
    destination: "/api/file/:fileId",
  })),
  ...["p", "paste"].map((prefix) => ({
    source: `/${prefix}/:pasteId.:extension`,
    destination: "/api/paste/:pasteId",
  })),
  ...["l", "s", "link"].map((prefix) => ({
    source: `/${prefix}/:linkId`,
    destination: "/api/link/:linkId",
  })),
  ...["f", "v", "i"].map((prefix) => ({
    source: `/${prefix}/:fileId`,
    destination: "/file/:fileId",
  })),
  { source: "/p/:pasteId", destination: "/paste/:pasteId" },
];
