import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// demo-2026-strata-v3 — MVP MBI consuming P1's strata-design-system
// Source-level alias to avoid needing `npm run build:lib` in the DS first.
const DS_ROOT = path.resolve(dirname, '../design system/strata-ds');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5180,
    strictPort: false,
  },
  resolve: {
    // Force a single copy of React (and friends) across v3 + DS source.
    // Without this we hit "A React Element from an older version of React
    // was rendered" because v3 and the DS folder each have their own
    // node_modules/react.
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    alias: [
      // Hard-pin react to v3's copy. Even with `dedupe`, sub-paths like
      // jsx-runtime can sneak in from the DS folder otherwise.
      {
        find: 'react/jsx-dev-runtime',
        replacement: path.resolve(dirname, 'node_modules/react/jsx-dev-runtime.js'),
      },
      {
        find: 'react/jsx-runtime',
        replacement: path.resolve(dirname, 'node_modules/react/jsx-runtime.js'),
      },
      {
        find: /^react$/,
        replacement: path.resolve(dirname, 'node_modules/react'),
      },
      {
        find: /^react-dom$/,
        replacement: path.resolve(dirname, 'node_modules/react-dom'),
      },
      {
        find: /^react-dom\//,
        replacement: path.resolve(dirname, 'node_modules/react-dom') + '/',
      },

      // The DS package itself → its source barrel (no rebuild needed in dev).
      {
        find: 'strata-design-system',
        replacement: path.resolve(DS_ROOT, 'src/components/index.ts'),
      },
      // DS internal `@/...` imports — these MUST resolve to DS source, not v3.
      // The DS source uses `@/utils`, `@/components/...`, `@/contexts/...`.
      // Order matters: more specific aliases first, then the v3 catch-all `@`.
      {
        find: /^@\/utils$/,
        replacement: path.resolve(DS_ROOT, 'src/utils'),
      },
      {
        find: /^@\/utils\//,
        replacement: path.resolve(DS_ROOT, 'src/utils') + '/',
      },
      {
        find: /^@\/components\//,
        replacement: path.resolve(DS_ROOT, 'src/components') + '/',
      },
      {
        find: /^@\/contexts\//,
        replacement: path.resolve(DS_ROOT, 'src/contexts') + '/',
      },
      // v3 catch-all (must come last). v3 uses `@/types`, `@/config`,
      // `@/context` (singular, distinct from DS `@/contexts`), etc.
      {
        find: '@',
        replacement: path.resolve(dirname, './src'),
      },
    ],
  },
  optimizeDeps: {
    // Force pre-bundling so Vite resolves react from v3's node_modules
    // before the DS folder gets a chance to ship its own copy.
    include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
  },
});
