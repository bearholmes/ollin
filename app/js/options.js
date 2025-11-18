// @ts-check
/*jshint browser: true */
'use strict';

/**
 * @file Ollin Options Page Script
 * @description Chrome Extension options page initialization
 * @author bearholmes
 * @version 0.6.0
 * @license MIT
 */

/// <reference path="../../src/types/index.ts" />

/**
 * manifest.json에서 확장 프로그램 정보 가져오기
 * @type {import('../../src/types/index').ChromeManifest}
 */
const manifest = chrome.runtime.getManifest();
/** @type {string} */
const name = manifest.name;
/** @type {string} */
const version = manifest.version;

/**
 * 옵션 페이지 DOM 초기화
 * 확장 프로그램 이름과 버전 정보를 페이지에 표시
 */
function initOptionPage() {
  const titleElement = document.getElementById('ollin-title');
  const versionElement = document.getElementById('ollin-version');

  if (titleElement) {
    titleElement.innerText = name;
  }

  if (versionElement) {
    versionElement.innerText = version;
  }

  document.title = `${name} - Option`;
}

// DOM 로드 완료 시 초기화
window.addEventListener('DOMContentLoaded', initOptionPage);
