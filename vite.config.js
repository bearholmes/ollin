/**
 * Vite Configuration for Ollin Chrome Extension
 * Simplified build that preserves original structure
 */

import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  // Root directory for source files
  root: '.',

  // Base public path
  base: './',

  // Build configuration
  build: {
    // Output directory
    outDir: 'dist/chrome',

    // Empty output directory before build
    emptyOutDir: true,

    // Don't generate sourcemaps for production
    sourcemap: false,

    // No minification to preserve Chrome Extension structure
    minify: false,

    // Copy build - no bundling
    copyPublicDir: false,

    // Target modern browsers (Chrome Extension)
    target: 'es2020'
  },

  // Plugins
  plugins: [
    // Copy all extension files
    viteStaticCopy({
      targets: [
        // Root files
        {
          src: 'app/manifest.json',
          dest: '.'
        },
        {
          src: 'app/background.js',
          dest: '.'
        },
        {
          src: 'app/*.html',
          dest: '.'
        },
        // JavaScript files
        {
          src: 'app/js/*',
          dest: 'js'
        },
        // CSS files
        {
          src: 'app/css/*',
          dest: 'css'
        },
        // Icons
        {
          src: 'app/icons/*',
          dest: 'icons'
        },
        // Locales
        {
          src: 'app/_locales/**/*',
          dest: '_locales'
        }
      ]
    })
  ]
});
