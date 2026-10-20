const search = 'https://www.google.com/search?q=';
const AIRemover = " -ai"

async function updateTab(tabId, changeInfo, tab) {
    console.log(tab.url, changeInfo);
    var result = await browser.storage.local.get(['key']);
    if (result && result.key == 'ON') {
        if (tab.url.startsWith(search) && tab.url.indexOf(AIRemover.trim()) < 0) {
            var andPos = tab.url.indexOf("&");
            var newURL = tab.url.substring(0, andPos) + AIRemover + tab.url.substring(andPos);
            console.log("newURL: ", newURL);
            try {
                await chrome.tabs.update(tab.id, {url: newURL});
            } catch (error) {
                console.error(error);
            }
        }
    } else {
        if (tab.url.startsWith(search) && tab.url.indexOf(AIRemover.trim()) > 0) {
            var newURL = tab.url.replace(AIRemover.trim(), "");
            try {
                await chrome.tabs.update(tab.id, {url: newURL});
            } catch (error) {
                console.error(error);
            }
        }
    }
}

var states = ["ON", "OFF"];

browser.runtime.onInstalled.addListener(async () => {
    var result = await browser.storage.local.get(['key']);
    if (result && result.key) {
        browser.action.setIcon({
            path: ("test" + (states.indexOf(result.key) + 1) + ".png")
        });
    }
});

browser.tabs.onUpdated.addListener(updateTab);