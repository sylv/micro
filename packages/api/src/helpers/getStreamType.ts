import fileType from "file-type";
import { isBinary } from "istextorbinary";
import * as mimeType from "mime-types";
import path from "path";

// is-binary scans the first 1kb
// file-type scans the first 4.2kb
const SCAN_BYTE_COUNT = 4200;
// overrides for types that are poorly mapped by sharex
const EXT_TEXT_MAP = new Map<string, string>();
EXT_TEXT_MAP.set("ts", "text/plain");
EXT_TEXT_MAP.set("tsx", "text/plain");
EXT_TEXT_MAP.set("jsx", "text/plain");

async function readFirstBytes(stream: NodeJS.ReadableStream) {
  let count = 0;
  let chunks: any[] = [];
  for await (const chunk of stream) {
    count += chunk.length;
    chunks.push(chunk);
    if (count > SCAN_BYTE_COUNT) break;
  }

  return Buffer.concat(chunks);
}

export async function getStreamType(fileName: string, stream: NodeJS.ReadableStream) {
  const firstBytes = await readFirstBytes(stream);
  const binary = isBinary(fileName, firstBytes);
  if (binary) {
    const result = await fileType.fromBuffer(firstBytes);
    return result?.mime ?? "application/octet-stream";
  }

  const ext = path.extname(fileName).slice(1);
  if (!ext) return "application/octet-stream";
  const mapped = EXT_TEXT_MAP.get(ext);
  if (mapped) return mapped;
  return mimeType.lookup(ext);
}
