var states = ['ON', 'OFF'];
var toggled = states[1];

var methods = [' -ai', '&tbs=1'];
var method = methods[1];

const mainToggle = document.getElementById("mainToggle");
const methodToggle = document.getElementById("methodToggle");

var saveData = [toggled];

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
    methodToggle.innerText = "Method: " + method;
}

async function toggle() {
    toggled = toggled === states[0] ? states[1] : states[0];
    saveData[0] = toggled;
    saveData[1] = method;

    /*browser.action.setBadgeText({
        text: toggled
    });*/

    popupVisuals();

    await browser.storage.local.set({key: saveData});
}

async function changeMethod() {
    var index = methods.indexOf(method);
    var newIndex = index + 1;
    if (newIndex > methods.length-1) {
        newIndex = 0;
    }
    method = methods[newIndex];
    saveData[0] = toggled;
    saveData[1] = method;
 
    popupVisuals();

    await browser.storage.local.set({key: saveData});
}

async function loadData() {
    var result = await browser.storage.local.get(['key']);
    if (result && result.key) {
        var temp = result.key;
        console.log(temp);
        if (typeof(result.key) != typeof('blank')) {
            temp = result.key[0];
            method = result.key[1];
        } 
        toggled = temp;
        popupVisuals();
    }
}

mainToggle.addEventListener("click", toggle);
methodToggle.addEventListener("click", changeMethod);
loadData();