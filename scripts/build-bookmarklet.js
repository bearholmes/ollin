#!/usr/bin/env node
/**
 * Build script for Ollin Bookmarklet
 * Copies and optionally minifies bookmarklet file
 */

import { cp, mkdir, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const sourceDir = join(projectRoot, 'bookmarklet');
const distDir = join(projectRoot, 'dist', 'bookmarklet');

async function build() {
  console.log('🚀 Building Ollin Bookmarklet...\n');

  try {
    // Clean dist directory
    if (existsSync(distDir)) {
      console.log('🧹 Cleaning dist directory...');
      await rm(distDir, { recursive: true, force: true });
    }

    // Create dist directory
    console.log('📁 Creating dist directory...');
    await mkdir(distDir, { recursive: true });

    // Copy bookmarklet file
    console.log('📦 Copying bookmarklet file...');
    await cp(join(sourceDir, 'ollin.js'), join(distDir, 'ollin.js'));

    console.log('\n✅ Build complete!');
    console.log(`📍 Output: ${distDir}`);
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();
