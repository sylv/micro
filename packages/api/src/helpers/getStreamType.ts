import fileType from "file-type";
import { isBinary } from "istextorbinary";
import * as mimeType from "mime-types";
import path from "path";
import { PassThrough } from "stream";

const DEFAULT_TYPE = "application/octet-stream";
// is-binary scans the first 1kb
// file-type scans the first 4.2kb
const SCAN_BYTE_COUNT = 4200;
// overrides for types that are poorly mapped by sharex
const EXT_TEXT_MAP = new Set(["ts", "tsx", "jsx"]);
const EXT_TEXT_TYPE = "text/plain";

async function readFirstBytes(stream: PassThrough) {
  let count = 0;
  let chunks: any[] = [];
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
  stream.end();
  const binary = isBinary(fileName, firstBytes);
  if (binary) {
    const result = await fileType.fromBuffer(firstBytes);
    return result?.mime ?? DEFAULT_TYPE;
  }

  const ext = path.extname(fileName).slice(1);
  if (ext) {
    const type = EXT_TEXT_MAP.has(ext) ? EXT_TEXT_TYPE : mimeType.lookup(ext) || undefined;
    return type;
  }
}
