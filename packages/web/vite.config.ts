import { preact } from '@preact/preset-vite';
import { vavite } from 'vavite';
import ssr from 'vike/plugin';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import codegen from 'vite-plugin-graphql-codegen';

export default defineConfig({
  buildSteps: [
    {
      name: 'client',
    },
    {
      name: 'server',
      config: {
        build: { ssr: true },
      },
    },
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  ssr: {
    noExternal: ['react-helmet-async', 'prism-react-renderer', 'qrcode.react', 'formik'],
  },
  plugins: [
    codegen(),
    eslint({ cache: true }),
    preact(),
    ssr({ disableAutoFullBuild: true }),
    vavite({
      handlerEntry: '/src/server/index.ts',
      serveClientAssetsInDev: true,
      clientAssetsDir: 'dist/client',
    }),
  ],
});
