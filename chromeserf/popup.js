document.addEventListener('DOMContentLoaded', function () {

    $('#form #start').click(function (e) {
        e.preventDefault();

        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.runtime.sendMessage({type: 'run', tabId: tabs[0].id}, response => {
                console.log(response);
            });
        });
    });

    $('#form #stop').click(function (e) {
       e.preventDefault();

        chrome.runtime.sendMessage({type: 'stopWork'}, response => {
            console.log(response);
        });
    });

});