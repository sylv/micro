export interface ThumbnailOptions {
  /**
   * The size of the thumbnail to generate
   * Either value can be excluded to maintain aspect ratio.
   */
  size?: { height?: number; width?: number };
  /**
   * Skip some improvements to improve performance.
   * The most important one is the video generator generating only one thumbnail instead of multiple and picking the one with the most detail.
   */
  fast?: boolean;
  type?: "image/webp" | "image/jpeg";
}
