(() => {
    let showButton = null;
    let playlists = [];
    // Watch for changes to the user's storage
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.options?.newValue) {
            showButton = Boolean(changes.options.newValue.showButton);
            //console.log('showButton Enabled?', showButton);
        }
        if (area === 'sync' && changes.playlists?.newValue) {
            playlists = changes.playlists.newValue;
            //console.log('All Playlists: ', playlists);

        }
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (tab && changeInfo.status === 'complete' && tab.url.includes("youtube.com/watch")) {
            const videoID = tab.url.split("?v=")[1].split("&")[0]
            // if button option is enabled send msg to content script
            chrome.tabs.sendMessage(tabId, {
                buttonEnabled: showButton,
                videoID: videoID
            })

        }
    });
})();