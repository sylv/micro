import { preact } from '@preact/preset-vite';
import { vavite } from 'vavite';
import ssr from 'vike/plugin';
import { defineConfig } from 'vite';

// todo: https://github.com/dotansimha/graphql-code-generator/issues/9774
export default defineConfig({
  buildSteps: [
    { name: 'client' },
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
    preact(),
    ssr({ disableAutoFullBuild: true }),
    vavite({
      handlerEntry: '/src/server/index.ts',
      serveClientAssetsInDev: true,
    }),
  ],
});
