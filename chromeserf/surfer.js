
/**
 * Surfer by profile pages
 *
 * @constructor
 */
function Surfer() {

}

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

Surfer.prototype.createTab = function (url, cb) {
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
                        });

                        resolve(tab);
                    } else {
                        setTimeout(function () {
                            reject("Limit rate executed 2000ms");
                        }, 2000);
                    }
                }
            });

        });
    });
};

Surfer.prototype.openWindows = function (urls) {

    var self = this;
    var urlCount = urls.length;

    var windowCreator = function (index) {
        if (!index) index = 0;

        if (index < urlCount) {
            return self.createTab(urls[index]).then(function (tab) {
                // Auto closed tab
                //chrome.tabs.remove(tab.id);

                console.log('Worked ', index, 'url', urls[index]);

                index++;
                return windowCreator(index);
            });
        } else {
            return Promise.reject({done: true});
        }
    };

    return windowCreator();
};