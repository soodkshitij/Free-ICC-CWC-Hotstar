/**
 * @author Kshitij Sood
*/

// change domain accordingly
const hotStrapRegExp = new RegExp('^https\:\/\/us\.hotstar\.com.*');

const CODE = `
    setInterval(function() { 
        localStorage.clear(); 
    }, 0);
    var interval = setInterval(function() {
        if (document.getElementsByClassName("vjs-fullscreen-control")!=0){
         document.getElementsByClassName('vjs-fullscreen-control')[0].click();
         clearInterval(interval);
        }
    }, 10);
    setInterval(function() { 
        window.location.reload(); 
    }, 170000);
`;

function getCurrentTab(cb) {
    chrome.tabs.query({
        'active': true,
        'windowId': chrome.windows.WINDOW_ID_CURRENT
    }, function (tabs) {
        cb(tabs[0]);
    });
}

function execCommand(tab, cmd, cb) {
    chrome.tabs.executeScript(tab.id, {
        code: cmd
    }, cb);
}

function injectCode(tab) {
    if (tab && hotStrapRegExp.test(tab.url)) {
        execCommand(tab, CODE, function (out) {
            console.log('Executed command successfully', out);
        });
    } else {
        console.error('Script cannot be run on the current tab');
    }
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    injectCode(tab);
});


chrome.browserAction.onClicked.addListener(function () {
    getCurrentTab(function (tab) {
        injectCode(tab);
    });
});
