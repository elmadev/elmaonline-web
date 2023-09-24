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
        components: path.resolve(__dirname, 'src/components'),
        images: path.resolve(__dirname, 'src/images'),
        pages: path.resolve(__dirname, 'src/pages'),
        utils: path.resolve(__dirname, 'src/utils'),
        constants: path.resolve(__dirname, 'src/constants'),
        api: path.resolve(__dirname, 'src/api'),
        globalStyle: path.resolve(__dirname, 'src/globalStyle'),
        theme: path.resolve(__dirname, 'src/theme'),
        config: path.resolve(__dirname, 'src/config'),
        features: path.resolve(__dirname, 'src/features'),
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
