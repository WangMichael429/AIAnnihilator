var states = ['ON', 'OFF'];
var toggled = states[1];

const mainToggle = document.getElementById("mainToggle");

function popupVisuals() {
    browser.action.setIcon({
        path: ("test" + (states.indexOf(toggled) + 1) + ".png")
    });

    if (toggled == states[0]) {
        mainToggle.style.color = "rgb(0, 255, 0)";
    } else {
        mainToggle.style.color = "rgb(255, 0, 0)";
    }
    mainToggle.innerText = toggled;
}

async function toggle() {
    toggled = toggled === states[0] ? states[1] : states[0];

    /*browser.action.setBadgeText({
        text: toggled
    });*/

    popupVisuals();

    await browser.storage.local.set({key: toggled});
}

async function loadData() {
    var result = await browser.storage.local.get(['key']);
    if (result && result.key) {
        toggled = result.key;
        popupVisuals();
    }
}

mainToggle.addEventListener("click", toggle);
loadData();