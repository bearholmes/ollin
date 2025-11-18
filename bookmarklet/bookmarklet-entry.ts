/**
 * @file Ollin Bookmarklet Entry Point
 * @description Bookmarklet using shared core
 * @author bearholmes
 * @version 0.6.0
 * @license MIT
 */

import { createOllin } from '../src/ollin-core.js';

// Bookmarklet IIFE wrapper
(function () {
  'use strict';

  // Create and initialize Ollin overlay
  const ollin = createOllin('Ollin');
  ollin.init();
})();
