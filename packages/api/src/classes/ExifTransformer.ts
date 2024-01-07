/* eslint-disable sonarjs/cognitive-complexity */
import type { TransformOptions, TransformCallback } from 'stream';
import { Transform } from 'stream';

// note: this is pretty much just a copy/paste of https://github.com/joshbuddy/exif-be-gone
// for some reason typescript refuses to load this module during `pnpm build` and will
// complain about `export = ExifTransformer` and i'm honestly not gonna spend another however
// long it takes to fix it on this. i'm fairly sure the only way to fix it is change how
// exif-be-gone is published and i'm not gonna bother when i can just copy/paste it and call it
// a day.
export class ExifTransformer extends Transform {
  private static readonly app1Marker = Buffer.from('ffe1', 'hex');
  private static readonly exifMarker = Buffer.from('457869660000', 'hex'); // Exif\0\0
  private static readonly xmpMarker = Buffer.from('http://ns.adobe.com/xap', 'utf-8');
  private static readonly flirMarker = Buffer.from('FLIR', 'utf-8');
  private static readonly maxMarkerLength = Math.max(
    ExifTransformer.exifMarker.length,
    ExifTransformer.xmpMarker.length,
    ExifTransformer.flirMarker.length,
  );

  private remainingBytes?: number;
  private pending: Buffer[];

  constructor(options?: TransformOptions) {
    super(options);
    this.remainingBytes = undefined;
    this.pending = [];
  }

  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    this._scrub(false, chunk);
    callback();
  }

  _final(callback: TransformCallback) {
    while (this.pending.length > 0) {
      this._scrub(true);
    }
    callback();
  }

  _scrub(atEnd: boolean, chunk?: Buffer) {
    let pendingChunk = chunk ? Buffer.concat([...this.pending, chunk]) : Buffer.concat(this.pending);
    // currently haven't detected an app1 marker
    if (this.remainingBytes === undefined) {
      const app1Start = pendingChunk.indexOf(ExifTransformer.app1Marker);
      // no app1 in the current pendingChunk
      if (app1Start === -1) {
        // if last byte is ff, wait for more
        if (!atEnd && pendingChunk[pendingChunk.length - 1] === ExifTransformer.app1Marker[0]) {
          if (chunk) this.pending.push(chunk);
          return;
        }
      } else {
        // there is an app1, but not enough data to read to exif marker
        // so defer
        if (app1Start + ExifTransformer.maxMarkerLength + 4 > pendingChunk.length) {
          if (atEnd) {
            this.push(pendingChunk);
            this.pending.length = 0;
          } else if (chunk) {
            this.pending.push(chunk);
          }
          return;
          // we have enough, so lets read the length
        }
        const candidateMarker = pendingChunk.slice(app1Start + 4, app1Start + ExifTransformer.maxMarkerLength + 4);
        if (
          ExifTransformer.exifMarker.compare(candidateMarker, 0, ExifTransformer.exifMarker.length) === 0 ||
          ExifTransformer.xmpMarker.compare(candidateMarker, 0, ExifTransformer.xmpMarker.length) === 0 ||
          ExifTransformer.flirMarker.compare(candidateMarker, 0, ExifTransformer.flirMarker.length) === 0
        ) {
          // we add 2 to the remainingBytes to account for the app1 marker
          this.remainingBytes = pendingChunk.readUInt16BE(app1Start + 2) + 2;
          this.push(pendingChunk.slice(0, app1Start));
          pendingChunk = pendingChunk.slice(app1Start);
        }
      }
    }

    // we have successfully read an app1/exif marker, so we can remove data
    if (this.remainingBytes !== undefined && this.remainingBytes !== 0) {
      // there is more data than we want to remove, so we only remove up to remainingBytes
      if (pendingChunk.length >= this.remainingBytes) {
        const remainingBuffer = pendingChunk.slice(this.remainingBytes);
        this.pending = remainingBuffer.length > 0 ? [remainingBuffer] : [];
        this.remainingBytes = undefined;
        // this chunk is too large, remove everything
      } else {
        this.remainingBytes -= pendingChunk.length;
        this.pending.length = 0;
      }
    } else {
      // push this chunk
      this.push(pendingChunk);
      this.remainingBytes = undefined;
      this.pending.length = 0;
    }
  }
}
