import mime from "mime-types";
import sharp from "sharp";
import { Readable } from "stream";
import { ThumbnailOptions } from "./types";

export const IMAGE_TYPES = new Set(
  Object.keys(sharp.format)
    .map((key) => mime.lookup(key))
    .filter((key) => key && key.startsWith("image"))
);

export async function imageThumbnailGenerator(input: string | Buffer | Readable, options?: ThumbnailOptions) {
  const format = options?.type === "image/jpeg" ? "jpeg" : "webp";
  if (input instanceof Readable) {
    const transformer = sharp().resize(options?.size?.width, options?.size?.height).toFormat(format);
    const transformed = input.pipe(transformer);
    return { stream: transformed };
  }

  return {
    stream: sharp(input).resize(options?.size?.width, options?.size?.height).toFormat(format),
  };
}
