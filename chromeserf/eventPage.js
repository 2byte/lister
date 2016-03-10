'use strict';

let siteTabId;

let Surf = new Surfer();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // Run script
    if (message.type == 'run') {

        siteTabId = message.tabId;

        Surf.run(siteTabId).then(() => {
            sendResponse('OK');
        });
    }

    // Handler received users
    if (message.type == 'popupExecutor') {

        Surf.openWindows(message.users)
            .then(() => {
                console.log('Script worked all windows.');

                // Go next page
                if (Surf.windowsComplete) {
                    Surf.goNextPage(siteTabId).then((res) => {
                        Surf.run(siteTabId);
                    });
                }
            }).catch(err => console.log(err));

        sendResponse('OK');
    }

    // Count view profile
    if (message.type == 'increment-view-profile') {

        sendResponse('OK');
    }

    if (message.type == 'stopWork') {
        Surf.stopWork();

        sendResponse('OK');
    }

    console.log("Message eventPage", message);
});