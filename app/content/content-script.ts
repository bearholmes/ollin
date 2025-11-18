/**
 * @file Ollin Content Script - Chrome Extension Entry Point
 * @description Chrome Extension content script using shared core
 * @author bearholmes
 * @version 0.6.0
 * @license MIT
 */

import { createOllin } from '../../shared/ollin-core.js';

// Get extension name from manifest
const contentManifest = chrome.runtime.getManifest();
const extensionName: string = contentManifest.name;

// Create and initialize Ollin overlay
const ollin = createOllin(extensionName);
ollin.init();
