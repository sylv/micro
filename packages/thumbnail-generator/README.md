# @ryanke/thumbnail-generator

Generates thumbnails for videos and images. Should be fairly fast but of course not nearly as fast as some other options in other languages and so you should probably not use it for anything on-demand. Or maybe you should, who knows.

> At the moment video thumbnail generation from a stream is not possible, a path must be provided.

## usage

```ts
import {
  generateThumbnailToStream,
  generateVideoThumbnailToStream,
  checkThumbnailSupport,
} from "@ryanke/thumbnail-generator";

// to handle images and videos in one, pass in the mime type with a path, stream or buffer
// in the ideal world you should always prefer a path, but when thats not possible streams and buffers are fine.
const stream = await generateThumbnailToStream("image/jpeg", inputStream);
const stream = await generateThumbnailToStream("video/mp4", "/path/to/video.mp4", {
  size: { height: 200 },
});

// if you already know what you want, use a generator directly
const stream = await generateVideoThumbnailToStream(inputStream);

// passing in a mime type that is unsupported will throw an error, so make sure to check
// for support before attempting to generate a thumbnail.
checkThumbnailSupport("image/jpeg"); // true
```
