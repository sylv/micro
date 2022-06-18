import { createReadStream, createWriteStream } from "fs";
import { copyFile, rename } from "fs/promises";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { imageThumbnailGenerator, IMAGE_TYPES } from "./image-generator";
import { logger } from "./logger";
import { ThumbnailOptions } from "./types";
import { videoThumbnailGenerator, VIDEO_TYPES } from "./video-generator";
export * from "./types";

/**
 * Check if the given type is supported.
 * @returns true if the type is supported, false otherwise.
 */
export function checkThumbnailSupport(type: string) {
  return IMAGE_TYPES.has(type) || VIDEO_TYPES.has(type);
}

/**
 * Generate a video thumbnail and save it to a file.
 * @param input The input video, assumed to be an image with no additional checks.
 */
export async function generateVideoThumbnailToStream(input: string, options?: ThumbnailOptions): Promise<Readable> {
  const output = await videoThumbnailGenerator(input, options);
  const stream = createReadStream(output.path);
  stream.on("end", () => {
    output.cleanup().catch((error) => {
      logger(`Failed cleaning up "${output.path}"`, error);
    });
  });

  return stream;
}

/**
 * Generate a video thumbnail and save it to a file
 * @param input The input video, assumed to be a ffmpeg-compatible video with no additional checks
 * @param dest The output path
 */
export async function generateVideoThumbnailToPath(
  input: string,
  dest: string,
  options?: ThumbnailOptions
): Promise<void> {
  const output = await videoThumbnailGenerator(input, options);

  try {
    logger(`Moving "${output.path}" to "${dest}"`);
    await rename(output.path, dest);
  } catch (error: any) {
    // cross-device errors
    if (error.code === "EXDEV") {
      logger(`Cross-device error moving "${output.path}" to "${dest}", falling back to copy`);
      await copyFile(output.path, dest);
      return;
    }

    throw error;
  } finally {
    output.cleanup().catch((error) => {
      logger(`Failed cleaning up "${output.path}"`, error);
    });
  }
}

/**
 * Generate an image thumbnail and return it as a stream
 * @param input The input image, assumed to be an image with no additional checks.
 * @param dest The output path
 */
export async function generateImageThumbnailToStream(
  input: string | Buffer | Readable,
  options?: ThumbnailOptions
): Promise<Readable> {
  const output = await imageThumbnailGenerator(input, options);
  return output.stream;
}

/**
 * Generate an image thumbnail and save it to a file.
 * @param input The input image, assumed to be an image with no additional checks.
 * @param dest The output path
 */
export async function generateImageThumbnailToPath(
  input: string | Buffer | Readable,
  dest: string,
  options?: ThumbnailOptions
): Promise<void> {
  const output = await imageThumbnailGenerator(input, options);
  const stream = createWriteStream(dest);
  await pipeline(output.stream, stream);
}

/**
 * Generate a thumbnail and save it to a file.
 * @param inputType The type of the input, for example `image/jpeg` or `video/mp4`.
 * @param dest The output path
 * @throws if the given input type is not supported
 */
export async function generateThumbnailToPath(
  inputType: string,
  input: string,
  dest: string,
  options?: ThumbnailOptions
): Promise<void> {
  if (IMAGE_TYPES.has(inputType)) {
    return generateImageThumbnailToPath(input, dest, options);
  } else if (VIDEO_TYPES.has(inputType)) {
    return generateVideoThumbnailToPath(input, dest, options);
  } else {
    throw new Error(`Unsupported input type "${inputType}"`);
  }
}

/**
 * Generate a thumbnail and return it as a stream.
 * @param inputType The type of the input, for example `image/jpeg` or `video/mp4`.
 * @throws if the given input type is not supported
 */
export async function generateThumbnailToStream(
  inputType: string,
  input: string | Buffer | Readable,
  options?: ThumbnailOptions
): Promise<Readable> {
  if (IMAGE_TYPES.has(inputType)) {
    return generateImageThumbnailToStream(input, options);
  } else if (VIDEO_TYPES.has(inputType)) {
    if (typeof input !== "string") {
      throw new Error("Video thumbnails can only be generated given a path.");
    }

    return generateVideoThumbnailToStream(input, options);
  } else {
    throw new Error(`Unsupported input type "${inputType}"`);
  }
}
