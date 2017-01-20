/*jshint browser: true */
/*global chrome */

var $ = function() {
    return document.getElementById(arguments[0]);
};

function loadEvent() {
    chrome.storage.local.get('monitors', function(result) {
        var monitors = result.monitors;
        if (monitors) {
            $(monitors).selected = true;
        }
    });
    chrome.storage.local.get('resolutions', function(result) {
        var resolutions = result.resolutions;
        if (resolutions) {
            $(resolutions).selected = true;
        }
    });
}

function resRegEvent() {
    monitor = $("moniStd").value;
    resolution = $("resStd").value;

    chrome.storage.local.set({
        'monitors': monitor
    });
    chrome.storage.local.set({
        'resolutions': resolution
    });

    $("resStatus").innerText = "저장완료!";
}

window.addEventListener('DOMContentLoaded', function() {
    $("resBtn").addEventListener('click', resRegEvent, false);
    loadEvent();
});
