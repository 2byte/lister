document.addEventListener('DOMContentLoaded', function () {

    function getTabIdByUrl(url, cb) {
        url = url || 'http://www.collarspace.com';

        chrome.tabs.query({lastFocusedWindow: true}, function (tab) {
            var tabIdLastFocusWindow = tab.filter(function (item) {
                return item.url.indexOf(url) != -1;
            })[0];
        });
    }

    function injectJsToTab() {
        chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
            chrome.tabs.executeScript(tab[0].id, {
                file: 'popupExecutor.js'
            }, function () {
                console.log('Run script');
            });
        });
    }

    $('#form button').click(function (e) {
        e.preventDefault();

        injectJsToTab();

    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log("Start open windows....");

        // Creator tabs
        if (request.hasOwnProperty('popupExecutor')) {
            var urls = request.popupExecutor;

            new Surfer()
                .openWindows(urls)
                .then(function () {
                    sendResponse('OK');
                }).catch(function (err) {
                    console.log('Surfer error', err);
                });
        }
    });
});