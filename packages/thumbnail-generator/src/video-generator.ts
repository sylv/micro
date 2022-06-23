import { randomUUID } from 'crypto';
import { once } from 'events';
import ffmpeg from 'fluent-ffmpeg';
import { readdir, rm, stat } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { logger } from './logger';
import type { ThumbnailOptions } from './types';

export const VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/x-matroska',
  'video/x-ms-wmv',
  'video/x-m4v',
  'video/x-flv',
]);

/**
 * Generate a thumbnail for a video.
 * Extracts the "best" thumbnail by extracting multiple jpeg thumbnails and using the largest.
 */
export async function videoThumbnailGenerator(filePath: string, options?: ThumbnailOptions) {
  const tempId = randomUUID();
  const tempDir = join(tmpdir(), `.thumbnail-workspace-${tempId}`);
  logger(`Generating video thumbnail at "${tempDir}"`);

  // i have no clue why but the internet told me that doing it in multiple invocations is faster
  // and it is so whatever. maybe there is a way to do this faster, but this is already pretty fast.
  const positions = options?.fast ? ['5%'] : ['5%', '10%', '20%', '40%'];
  const size = options?.size ? `${options.size.width ?? '?'}x${options.size.height ?? '?'}` : '200x?';
  const ext = options?.type === 'image/jpeg' ? 'jpg' : 'webp';
  for (let positionIndex = 0; positionIndex < positions.length; positionIndex++) {
    const percent = positions[positionIndex];
    const stream = ffmpeg(filePath).screenshot({
      count: 1,
      timemarks: [percent],
      folder: tempDir,
      size: size,
      fastSeek: true,
      filename: `%b-${positionIndex + 1}.${ext}`,
    });

    await once(stream, 'end');
  }

  const files = await readdir(tempDir);
  let largest: { size: number; path: string } | undefined;
  for (const file of files) {
    const path = join(tempDir, file);
    const stats = await stat(path);
    if (!largest || stats.size > largest.size) {
      largest = { size: stats.size, path };
    }
  }

  if (!largest) {
    await rm(tempDir, { recursive: true, force: true });
    throw new Error('No thumbnails were generated');
  }

  logger(`Largest thumbnail is at "${largest.path}", ${largest.size} bytes`);

  return {
    path: largest.path,
    cleanup: async () => {
      logger(`Cleaning up "${tempDir}"`);
      await rm(tempDir, { recursive: true, force: true });
    },
  };
}
