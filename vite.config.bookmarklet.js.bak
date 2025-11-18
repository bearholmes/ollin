/**
 * Vite Configuration for Ollin Bookmarklet
 * @type {import('vite').UserConfig}
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Root directory
  root: 'bookmarklet',

  // Base public path
  base: './',

  // Build configuration
  build: {
    // Output directory
    outDir: '../dist/bookmarklet',

    // Empty output directory before build
    emptyOutDir: true,

    // Generate sourcemaps
    sourcemap: process.env.NODE_ENV !== 'production',

    // Minification for smaller bookmarklet
    minify: true,

    // Rollup options
    rollupOptions: {
      input: {
        ollin: resolve(__dirname, 'bookmarklet/ollin.js')
      },
      output: {
        // Output format: IIFE for bookmarklet
        format: 'iife',
        // Single file output
        entryFileNames: 'ollin.js',
        // Inline dynamic imports
        inlineDynamicImports: true
      }
    },

    // Target ES5 for maximum compatibility
    target: 'es5',

    // Library mode for bookmarklet
    lib: {
      entry: resolve(__dirname, 'bookmarklet/ollin.js'),
      name: 'ollin',
      formats: ['iife']
    }
  },

  // No plugins needed for bookmarklet
  plugins: [],

  // Minimal dependencies
  optimizeDeps: {
    exclude: []
  }
});
