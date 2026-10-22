const search = 'https://www.google.com/search?q=';
var methods = [' -ai', '&tbs=1'];

var states = ['ON', 'OFF'];

var AIRemover = methods[methods.length-1];
console.log(AIRemover);

async function disableRemover(tab) {
    if (tab.url.startsWith(search) && tab.url.indexOf(AIRemover.trim()) >= 0) {
        var newURL = tab.url.replace(AIRemover.trim(), "");
        try {
            await chrome.tabs.update(tab.id, {url: newURL});
        } catch (error) {
            console.error(error);
        }
    }
}

async function updateTab(tabId, changeInfo, tab) {
    console.log(tab.url, changeInfo);
    var result = await browser.storage.local.get(['key']);
    if (result && result.key) {
        var temp2 = result.key
        if (typeof(temp2) != typeof('')) {
            temp2 = result.key[0];
            AIRemover = result.key[1];
        }
        if (temp2 == states[0]) {
            if (tab.url.startsWith(search) && tab.url.indexOf(AIRemover.trim()) < 0) {
                var andPos = tab.url.indexOf("&");
                var newURL = tab.url.substring(0, andPos) + AIRemover + tab.url.substring(andPos);
                console.log("newURL: ", newURL);

                for (var i = 0; i < methods.length; i++) {
                    if (i != methods.indexOf(AIRemover) && newURL.indexOf(methods[i].trim()) > 0) {
                        newURL = newURL.replace(methods[i].trim(), "");
                    }
                }

                try {
                    await chrome.tabs.update(tab.id, {url: newURL});
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            disableRemover(tab);
        }
    } else {
        disableRemover(tab);
    }
}

browser.runtime.onInstalled.addListener(async () => {
    var result = await browser.storage.local.get(['key']);
    if (result && result.key) {
        var toggled2 = result.key;
        if (typeof(result.key) != typeof('')) {
            toggled2 = result.key[0];
            AIRemover = result.key[1];
        }
        console.log(toggled2, AIRemover);
        browser.action.setIcon({
            path: ("test" + (states.indexOf(toggled2) + 1) + ".png")
        });
    }
});

browser.tabs.onUpdated.addListener(updateTab);