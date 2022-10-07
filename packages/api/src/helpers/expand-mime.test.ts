import { expect, it } from 'vitest';
import { expandMime } from './expand-mime.js';

it('should expand mime types', () => {
  expect(expandMime('video')).toMatchSnapshot();
  expect(expandMime('image')).toMatchSnapshot();
  expect(expandMime(['image'])).toMatchSnapshot();
  expect(expandMime(['image', 'video/mp4'])).toMatchSnapshot();
  expect(expandMime(['image/*', 'video/mp4'])).toMatchSnapshot();
});
