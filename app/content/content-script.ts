/**
 * @file Ollin Content Script - Chrome Extension Entry Point
 * @description Chrome Extension content script using shared core
 * @author bearholmes

 * @license MIT
 */

import { createOllin } from '../../shared/ollin-core.js';
import { i18n } from '../shared/i18n.js';

// Get extension name using i18n
const extensionName: string = i18n('application_title');

// Create and initialize Ollin overlay with i18n support
const ollin = createOllin(extensionName, i18n);
ollin.init();
