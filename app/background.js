/*jshint browser: true */

/**
 * Ollin Chrome Extension Background Script (Service Worker)
 * 확장 프로그램 설치 및 아이콘 클릭 이벤트 처리
 */

/**
 * Chrome 내부 페이지 URL 패턴
 * @constant {string[]}
 */
const BLOCKED_URL_PATTERNS = ['chrome://', 'chrome-extension://', 'https://chrome.google.com'];

/**
 * 주입할 Content Scripts
 * @constant {object}
 */
const CONTENT_SCRIPTS = {
  js: ['js/content-script.js'],
  css: ['css/content-script.css']
};

/**
 * URL이 Chrome 내부 페이지인지 확인
 * @param {string} url - 체크할 URL
 * @returns {boolean} 내부 페이지이면 true
 */
function isInternalPage(url) {
  return BLOCKED_URL_PATTERNS.some((pattern) => url.indexOf(pattern) === 0);
}

/**
 * 확장 프로그램 설치/업데이트 시 옵션 페이지 열기
 * @param {object} details - 설치 상세 정보
 * @param {string} details.reason - 설치 이유 ('install', 'update', 'chrome_update')
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'options.html' });
  }
});

/**
 * 확장 아이콘 클릭 시 Content Script 주입
 * @param {object} tab - 활성 탭 정보
 * @param {number} tab.id - 탭 ID
 * @param {string} tab.url - 탭 URL
 */
chrome.action.onClicked.addListener((tab) => {
  // Chrome 내부 페이지에서는 실행 차단
  if (isInternalPage(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: () => alert('크롬 내부 페이지에서는 작동하지 않습니다.')
      })
      .catch((error) => {
        console.error('Script injection failed:', error);
      });
    return;
  }

  // Content Script 주입
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      files: CONTENT_SCRIPTS.js
    })
    .then(() => {
      // JavaScript 주입 성공 후 CSS 주입
      return chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: CONTENT_SCRIPTS.css
      });
    })
    .catch((error) => {
      console.error('Script/CSS injection failed:', error);
    });
});
