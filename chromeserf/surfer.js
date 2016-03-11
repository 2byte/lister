'use strict';

/**
 * Surfer by profile pages
 *
 * @constructor
 */
function Surfer() {
    this.tabs = [];
    this.stoppedWork = false;
    this.windowsComplete = false;
    this.countViewProfile = 0;
}

Surfer.prototype.run = function (tabId) {

    return new Promise((resolve, reject) => {
        chrome.tabs.executeScript(tabId, {
            file: 'popupExecutor.js'
        }, () => {
            console.log('Script runned.');

            resolve();
        });
    });

};

Surfer.prototype.getTabByUrl = function (url) {
    return new Promise(function () {
        url = url || 'http://www.collarspace.com';

        return chrome.tabs.query({lastFocusedWindow: true}, function (tab) {

            // Search tab by url
            var tabIdLastFocusWindows = tab.filter(function (item) {
                return item.url.indexOf(url) != -1;
            });

            return tabIdLastFocusWindows[0];
        });
    });
};

Surfer.prototype.createTab = function (url) {
    var self = this;

    return new Promise(function (resolve, reject) {
        chrome.tabs.create({
            url: url + '#surfer',
            active: false
        }, function (tab) {

            chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tabUpdated) {
                if (tabId == tab.id) {
                    if (changeInfo.status == 'complete') {

                        chrome.tabs.executeScript(tab.id, {
                            file: 'profileView.js'
                        }, () => {

                            // Auto close tab after
                            chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tabUpdated) {
                                if (tabId == tab.id && changeInfo.status == 'complete') {
                                    self.countViewProfile++;

                                    chrome.tabs.remove(tab.id);
                                }
                            });

                            // Send increment view profile
                            chrome.runtime.sendMessage({type: 'increment-view-profile', count: self.countViewProfile}, response => {});
                        });

                        resolve(tab);
                    }
                }
            });

        });
    });
};

Surfer.prototype.openWindows = function (users) {

    var self = this;
    var urlCount = users.length;
    var stoppedWork = false;

    return new Promise(function (resolve, reject) {

        var currentUrl = 0;

        var urlOpen = function () {
            if (currentUrl < urlCount) {
                self.createTab(users[currentUrl].url).then(function (tab) {

                    self.tabs.push({id: tab.id});

                    console.log('Opened user', users[currentUrl].username);

                    currentUrl++;

                    if (!self.stoppedWork) {
                        urlOpen();
                    } else {
                        resolve();
                    }

                }).catch(function (err) {
                    console.log(err);
                });
            } else {
                self.windowsComplete = true;

                resolve();
            }
        };

        urlOpen();

    });
};

Surfer.prototype.goNextPage = function (tabId) {
    this.tabs = [];

    return new Promise((resolve, reject) => {
        chrome.tabs.executeScript(tabId, {
            code: `location.href = $('a.console[title*="Show the next page of profiles"]:eq(0)').attr('href');`
        }, (res) => {
            chrome.tabs.update(tabId, {url: `http://www.collarspace.com${res[0]}`}, tab => {
                chrome.tabs.onUpdated.addListener((currentTabId, changeInfo, tabUpdated) => {
                    if (currentTabId == tabId && changeInfo.status == 'complete') {
                        resolve();
                    }
                });
            });
        });
    });
};

Surfer.prototype.stopWork = function () {
    this.windowsComplete = false;
    this.stoppedWork = true;
    this.tabs = [];

    console.log('Surfer stopped');
};

Surfer.prototype.test = function () {
    chrome.tabs.executeScript(23, {
        code: `location.href = $('a.console[title*="Show the next page of profiles"]:eq(0)').attr('href');`
    }, (res) => {
        chrome.tabs.update(23, {url: `http://www.collarspace.com${res[0]}`}, tab => {
            chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabUpdated) => {
                if (tabId == 23 && changeInfo.status == 'complete') {
                    console.log('Window complete');
                }
            });
        });
    });
};