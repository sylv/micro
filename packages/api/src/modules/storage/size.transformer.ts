import { Transform, type TransformCallback } from "stream";
import { config } from "../../config";

export class SizeTransform extends Transform {
  public sizeInBytes = 0;

  _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback) {
    const sizeInBytesAfterWritingChunk = this.sizeInBytes + Buffer.byteLength(chunk, encoding);

    if (sizeInBytesAfterWritingChunk > config.uploadLimit) {
      return callback(new Error(`Upload limit of ${config.uploadLimit} bytes exceeded`));
    }

    this.sizeInBytes = sizeInBytesAfterWritingChunk;
    callback(null, chunk);
  }
}
