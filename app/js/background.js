/*jshint browser: true */
/*global chrome */

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        chrome.tabs.create( {url: "option.html"} );
    }
});
// || details.reason == "update" 제외

chrome.browserAction.onClicked.addListener(function(tab) {
    if (tab.url.indexOf("https://chrome.google.com") == 0 || tab.url.indexOf("chrome://") == 0) {
        alert("크롬 내부 페이지에서는 작동하지 않습니다."); //It does not work on Google Chrome Internal pages
        return;
    }
    chrome.tabs.executeScript(tab.id, {file: 'js/dkoverlay.js'});
    chrome.tabs.insertCSS(tab.id, {file: 'css/dkoverlay.css'});
});
