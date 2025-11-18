#!/usr/bin/env node
/**
 * Post-build script for Ollin Chrome Extension
 * Copies static files after Vite build
 */

import { cp, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const sourceDir = join(projectRoot, 'app');
const distDir = join(projectRoot, 'dist', 'chrome');

async function postBuild() {
  console.log('📦 Copying static files...\n');

  try {
    // Copy manifest.json
    console.log('  ✓ manifest.json');
    await cp(join(sourceDir, 'manifest.json'), join(distDir, 'manifest.json'));

    // Copy options HTML and CSS
    console.log('  ✓ options/options.html');
    await mkdir(join(distDir, 'options'), { recursive: true });
    await cp(join(sourceDir, 'options', 'options.html'), join(distDir, 'options', 'options.html'));
    console.log('  ✓ options/options.css');
    await cp(join(sourceDir, 'options', 'options.css'), join(distDir, 'options', 'options.css'));

    // Copy content CSS
    console.log('  ✓ content/content-script.css');
    await mkdir(join(distDir, 'content'), { recursive: true });
    await cp(
      join(sourceDir, 'content', 'content-script.css'),
      join(distDir, 'content', 'content-script.css')
    );

    // Copy icons
    console.log('  ✓ icons/');
    await cp(join(sourceDir, 'icons'), join(distDir, 'icons'), { recursive: true });

    // Copy locales
    console.log('  ✓ _locales/');
    await cp(join(sourceDir, '_locales'), join(distDir, '_locales'), { recursive: true });

    console.log('\n✅ Static files copied successfully!');
  } catch (error) {
    console.error('❌ Failed to copy static files:', error.message);
    process.exit(1);
  }
}

postBuild();
