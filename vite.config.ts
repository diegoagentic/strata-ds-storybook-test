import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// demo-2026-strata-v3 — standalone build that consumes the strata-design-system
// from a vendored tarball (./vendor/strata-design-system-*.tgz). When this repo
// runs as part of the larger Strata workspace and you want HMR against the DS
// source, change package.json's strata-design-system dep back to a file:// path
// pointing at the DS folder.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5180,
    strictPort: false,
  },
  resolve: {
    alias: [
      // v3 catch-all for `@/types`, `@/config`, `@/context`, `@/components`, etc.
      {
        find: '@',
        replacement: path.resolve(dirname, './src'),
      },
    ],
  },
});
