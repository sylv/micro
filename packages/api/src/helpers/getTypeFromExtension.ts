import fileType from "file-type";
import path from "path";
import { isBinaryFile } from "isbinaryfile";
import * as mimeType from "mime-types";

// overrides for types that are poorly mapped by sharex
const EXT_TEXT_MAP = new Map<string, string>();
EXT_TEXT_MAP.set("ts", "text/plain");
EXT_TEXT_MAP.set("tsx", "text/plain");
EXT_TEXT_MAP.set("jsx", "text/plain");

export async function getTypeFromExtension(fileName: string, buffer: Buffer) {
  const isBinary = await isBinaryFile(buffer);
  if (isBinary) {
    const result = await fileType.fromBuffer(buffer);
    return result?.mime ?? "application/octet-stream";
  }

  const ext = path.extname(fileName).slice(1);
  const mapped = EXT_TEXT_MAP.get(ext);
  if (mapped) return mapped;
  return mimeType.lookup(ext);
}
