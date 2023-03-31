import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts', 'src/migrations/*'],
  outDir: '.tsup-build',
  target: 'node18',
  sourcemap: true,
  clean: true,
});
