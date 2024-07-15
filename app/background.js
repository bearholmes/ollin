/*jshint browser: true */
/*global chrome */

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        chrome.tabs.create({ url: "option.html" });
    }
});

chrome.action.onClicked.addListener(function(tab) {
    if (tab.url.indexOf("https://chrome.google.com") === 0 || tab.url.indexOf("chrome://") === 0) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => alert("크롬 내부 페이지에서는 작동하지 않습니다.") // It does not work on Google Chrome Internal pages
        });
        return;
    }
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['js/dkoverlay.js']
    });
    chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['css/dkoverlay.css']
    });
});
