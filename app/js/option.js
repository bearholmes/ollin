/*jshint browser: true */
/*global chrome */
"use strict";

/**
 * Ollin Options Page Script
 * 확장 프로그램 옵션 페이지 초기화
 */

/**
 * manifest.json에서 확장 프로그램 정보 가져오기
 */
const manifest = chrome.runtime.getManifest();
const name = manifest.name;
const version = manifest.version;

/**
 * 옵션 페이지 DOM 초기화
 * 확장 프로그램 이름과 버전 정보를 페이지에 표시
 */
function initOptionPage() {
    const titleElement = document.getElementById("dk_title");
    const versionElement = document.getElementById("dk_ver");

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
