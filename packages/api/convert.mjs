import fs from 'fs/promises';
import { extname, join, dirname } from 'path';
import { fileURLToPath } from 'url';

// convert all .js files to .cjs to work around fun ncc issues
// this only matters in dev testing build outputs because in prod
// the package.json with type:module isn't present
const walk = async (directory) => {
  const handle = await fs.opendir(directory);
  for await (const dirent of handle) {
    if (dirent.isDirectory()) {
      await walk(join(directory, dirent.name));
    } else {
      if (dirent.name.endsWith('.js')) {
        const withoutExt = dirent.name.slice(extname(dirent.name).length);
        const updatedPath = join(directory, withoutExt + '.cjs');
        await fs.rename(join(directory, dirent.name), updatedPath);
      }
    }
  }
};

const dirName = dirname(fileURLToPath(import.meta.url));
await walk(join(dirName, 'dist'));
