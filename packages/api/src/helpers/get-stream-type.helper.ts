import { fileTypeFromBuffer } from 'file-type';
import * as mimeType from 'mime-types';
import path from 'path';
import type { PassThrough } from 'stream';
// @ts-expect-error type error? i guess?
import { isBinary } from 'istextorbinary';

const DEFAULT_TYPE = 'application/octet-stream';
// is-binary scans the first 1kb
// file-type scans the first 4.2kb
const SCAN_BYTE_COUNT = 4200;
// overrides for types that are poorly mapped by sharex
const EXT_TEXT_MAP = new Set(['ts', 'tsx', 'jsx', 'ejs', 'cjs', 'mjs']);
const EXT_TEXT_TYPE = 'text/plain';

async function readFirstBytes(stream: PassThrough) {
  let count = 0;
  const chunks: any[] = [];
  for await (const chunk of stream) {
    count += chunk.length;
    chunks.push(chunk);
    if (count > SCAN_BYTE_COUNT) break;
  }

  stream.end();
  return Buffer.concat(chunks);
}

export async function getStreamType(fileName: string, stream: PassThrough): Promise<string | undefined> {
  const firstBytes = await readFirstBytes(stream);
  const binary = isBinary(fileName, firstBytes);
  if (binary) {
    const result = await fileTypeFromBuffer(firstBytes);
    return result?.mime ?? DEFAULT_TYPE;
  }

  const extension = path.extname(fileName).slice(1);
  if (extension) {
    return EXT_TEXT_MAP.has(extension) ? EXT_TEXT_TYPE : mimeType.lookup(extension) || undefined;
  }
}
