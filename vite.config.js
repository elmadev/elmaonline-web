import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'build',
      sourcemap: true,
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        components: '/src/components',
        images: '/src/images',
        pages: '/src/pages',
        utils: '/src/utils',
        constants: '/src/constants',
        api: '/src/api',
        globalStyle: '/src/globalStyle',
        theme: '/src/theme',
        config: '/src/config',
        features: '/src/features',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
  };
});
