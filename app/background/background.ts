/**
 * @file Ollin Background Script - Service Worker
 * @description Chrome Extension background service worker for extension lifecycle management
 * @author bearholmes
 * @version 0.6.0
 * @license MIT
 */

/**
 * Chrome internal page URL patterns
 */
const BLOCKED_URL_PATTERNS: string[] = [
  'chrome://',
  'chrome-extension://',
  'https://chrome.google.com'
];

/**
 * Content scripts to inject
 */
interface ContentScripts {
  js: string[];
  css: string[];
}

const CONTENT_SCRIPTS: ContentScripts = {
  js: ['content/content-script.js'],
  css: ['content/content-script.css']
};

/**
 * Check if URL is a Chrome internal page
 */
function isInternalPage(url: string | undefined): boolean {
  if (!url) return true;
  return BLOCKED_URL_PATTERNS.some((pattern) => url.indexOf(pattern) === 0);
}

/**
 * Open options page on extension install/update
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    void chrome.tabs.create({ url: 'options/options.html' });
  }
});

/**
 * Inject content script when extension icon is clicked
 */
chrome.action.onClicked.addListener((tab) => {
  // Block execution on Chrome internal pages
  if (isInternalPage(tab.url) || !tab.id) {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        func: () => alert('크롬 내부 페이지에서는 작동하지 않습니다.')
      })
      .catch((error) => {
        console.error('Script injection failed:', error);
      });
    return;
  }

  // Inject content script
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      files: CONTENT_SCRIPTS.js
    })
    .then(() => {
      // Inject CSS after JavaScript injection succeeds
      return chrome.scripting.insertCSS({
        target: { tabId: tab.id! },
        files: CONTENT_SCRIPTS.css
      });
    })
    .catch((error) => {
      console.error('Script/CSS injection failed:', error);
    });
});
