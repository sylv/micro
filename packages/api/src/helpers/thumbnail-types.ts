import sharp from "sharp";
import mime from "mime-types";

export const IMAGE_TYPES = new Set(
  Object.keys(sharp.format)
    .map((key) => mime.lookup(key))
    .filter((key) => key && key.startsWith("image")),
) as Set<string>;

export const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/x-matroska",
  "video/x-ms-wmv",
  "video/x-m4v",
  "video/x-flv",
]);

export function supportsThumbnail(fileType: string) {
  return IMAGE_TYPES.has(fileType) || VIDEO_TYPES.has(fileType);
}
