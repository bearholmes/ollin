#!/usr/bin/env node
/**
 * Build script for Ollin Chrome Extension
 * Copies files from app/ to dist/chrome/
 */

import { cp, mkdir, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const sourceDir = join(projectRoot, 'app');
const distDir = join(projectRoot, 'dist', 'chrome');

async function build() {
  console.log('🚀 Building Ollin Chrome Extension...\n');

  try {
    // Clean dist directory
    if (existsSync(distDir)) {
      console.log('🧹 Cleaning dist directory...');
      await rm(distDir, { recursive: true, force: true });
    }

    // Create dist directory
    console.log('📁 Creating dist directory...');
    await mkdir(distDir, { recursive: true });

    // Copy all files from app/ to dist/chrome/
    console.log('📦 Copying extension files...');
    await cp(sourceDir, distDir, {
      recursive: true,
      filter: (source) => {
        // Skip hidden files and .DS_Store
        const basename = source.split('/').pop();
        return !basename.startsWith('.') && basename !== 'DS_Store';
      }
    });

    console.log('\n✅ Build complete!');
    console.log(`📍 Output: ${distDir}`);
    console.log('\n💡 Load the extension in Chrome:');
    console.log('   1. Go to chrome://extensions/');
    console.log('   2. Enable "Developer mode"');
    console.log('   3. Click "Load unpacked"');
    console.log(`   4. Select: ${distDir}\n`);
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();
