chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "openBackgroundTab") {
        chrome.tabs.create({
            url: msg.url,
            active: false
        });
    }
});


chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.action === "downloadImage") {
        
        chrome.downloads.download(
            {
                url: msg.url,
                conflictAction: "uniquify"
            },
            () => {
                if (sender.tab && sender.tab.id) {
                    chrome.tabs.remove(sender.tab.id);
                }
            }
        );
    }
});
