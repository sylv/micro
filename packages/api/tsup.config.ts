import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts', 'src/migrations/*'],
  outDir: 'dist',
  target: 'node18',
  format: 'esm',
  sourcemap: true,
  clean: true,
});
