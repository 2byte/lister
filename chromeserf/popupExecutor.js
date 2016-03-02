(function () {

    var profileRows = [];

    function collectUsers() {
        $(document).ready(function () {
            var selectors = [
                '.HeadDF',
                '.HeadDM',
                '.HeadSM'
            ];

            selectors.forEach(function (item) {
                var profiles = $(item).find('a[href*="/personals"]');

                profiles.each(function (index, profile) {
                    profileRows.push(profile.href);
                });

            });
        });
    }

    function sendMessagePoup () {
        if (profileRows) {
            chrome.runtime.sendMessage({popupExecutor: profileRows}, function (response) {

                console.log('Visited', response);

                var nextLink = $('a[title*="Show the next page"]');

                if (nextLink) {
                    profileRows = [];
                    nextLink[0].click();
                }
            });
        }
    }

    collectUsers();
    sendMessagePoup();

})();