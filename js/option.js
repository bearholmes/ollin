/*jshint browser: true */
/*global chrome */
var manifest = chrome.runtime.getManifest();
var name = manifest.name;
var ver = manifest.version;
window.onload = function()
{
document.title = name + "- Option";
document.getElementById("dk_title").innerText = name;
document.getElementById("dk_ver").innerText = "버전 : " + ver;
}
