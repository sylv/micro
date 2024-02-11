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
  optimizeDeps: {
    include: ['preact', 'preact/devtools', 'preact/debug', 'preact/jsx-dev-runtime', 'preact/hooks', 'urql'],
  },
  define: { 'process.env.NODE_ENV': '"production"' },
  ssr: {
    noExternal: ['preact', 'urql', 'prism-react-renderer', 'qrcode.react', 'formik', 'react-helmet-async'],
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
