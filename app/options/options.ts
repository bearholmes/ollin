/**
 * @file Ollin Options Page Script
 * @description Chrome Extension options page initialization
 * @author bearholmes
 * @version 0.6.0
 * @license MIT
 */

/**
 * Get extension info from manifest.json
 */
const extensionManifest = chrome.runtime.getManifest();
const extensionName: string = extensionManifest.name;
const extensionVersion: string = extensionManifest.version;

/**
 * Initialize options page DOM
 * Display extension name and version on the page
 */
function initOptionPage(): void {
  const titleElement = document.getElementById('ollin-title');
  const versionElement = document.getElementById('ollin-version');

  if (titleElement) {
    titleElement.innerText = extensionName;
  }

  if (versionElement) {
    versionElement.innerText = extensionVersion;
  }

  document.title = `${extensionName} - Option`;
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', initOptionPage);
