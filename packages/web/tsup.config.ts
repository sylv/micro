import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['dist/server/index.mjs'],
  outDir: 'dist',
  target: 'node20',
  format: 'esm',
  sourcemap: false,
  minify: true,
  noExternal: [/(.*)/],
  define: {
    'process.env.STATIC_DIR': "'{{FILE_DIR}}/client'",
    'process.env.NODE_ENV': "'production'",
  },
  banner: {
    js: "const require = (await import('node:module')).createRequire(import.meta.url);const __filename = (await import('node:url')).fileURLToPath(import.meta.url);const __dirname = (await import('node:path')).dirname(__filename);",
  },
});
