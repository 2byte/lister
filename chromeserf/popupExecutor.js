(function () {

    var profiles = [];

    function collectUsers() {
        $(document).ready(function () {
            var profileRows = $('.row')
                .css({
                    'font': 3,
                    'face': 'Trebuchet MS, Arial, Helvetica, sans-serif'
                }).find('a').each(function (item) {
                    profiles.push(this.href);
                });
        });
    }

    function sendMessagePopup (users) {
        if (users) {
            chrome.runtime.sendMessage({type: 'popupExecutor', users: users}, function (response) {

                console.log('Send users:', response);
            });
        } else {
            console.log('Not users');
        }
    }

    collectUsers();
    sendMessagePopup(profiles);

})();