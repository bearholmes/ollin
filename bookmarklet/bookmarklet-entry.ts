/**
 * @file Ollin Bookmarklet Entry Point
 * @description Bookmarklet using shared core
 * @author bearholmes
 * @version 0.6.0
 * @license MIT
 */

import { createOllin } from '../shared/ollin-core.js';
import type { I18nFunction } from '../types/index.js';

// Bookmarklet IIFE wrapper
(function () {
  'use strict';

  // Fallback i18n function for bookmarklet (Korean default)
  const i18n: I18nFunction = (key: string): string => {
    const messages: Record<string, string> = {
      application_title: 'Ollin',
      error_invalid_file_type: '이미지 파일만 선택할 수 있습니다.',
      error_file_read_failed: '파일을 읽을 수 없습니다.',
      error_image_load_failed: '이미지 파일을 불러올 수 없습니다.'
    };
    return messages[key] || key;
  };

  // Create and initialize Ollin overlay with fallback i18n
  const ollin = createOllin('Ollin', i18n);
  ollin.init();
})();
