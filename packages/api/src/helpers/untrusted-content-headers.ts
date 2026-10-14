// which types of content are allowed to be rendered inline
const INLINE_TYPES = new Set([
  "text/plain",
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/avif", "image/bmp", "image/tiff", "image/x-icon",
  "audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav", "audio/webm", "audio/flac",
  "video/mp4", "video/webm", "video/ogg", "video/quicktime",
]);

export function untrustedContentHeaders(type: string, filename?: string) {
  const mime = type.split(";", 1)[0].trim().toLowerCase();
  const inline = INLINE_TYPES.has(mime);
  const sandbox = inline && (mime.startsWith("audio/") || mime.startsWith("video/"))
    ? "sandbox allow-same-origin"
    : "sandbox";

  // putting the raw filename straight into the header is bad
  const encodedName = filename === undefined ? "" : encodeURIComponent(Buffer.from(filename, "utf8").toString("utf8"))
    .replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);

  return {
    "Content-Type": inline ? (mime === "text/plain" ? "text/plain; charset=UTF-8" : mime) : "application/octet-stream",
    "Content-Disposition": `${inline ? "inline" : "attachment"}${filename === undefined ? "" : `; filename*=UTF-8''${encodedName}`}`,
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": `${sandbox}; default-src 'none'; script-src 'none'; style-src 'none'; img-src 'self' data: blob:; media-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'`,
    "Cache-Control": "public, no-cache",
  };
}
