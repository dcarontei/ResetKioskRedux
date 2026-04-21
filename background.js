let timeoutSeconds = 1200;
let disableContextMenu = false;
let timer = null;

// Load settings on startup
browser.storage.sync.get(["timeoutSeconds", "disableContextMenu"]).then((res) => {
  timeoutSeconds = res.timeoutSeconds ?? 1200; // 20 minutes default
  disableContextMenu = res.disableContextMenu ?? false;
});

// Listen for settings changes
browser.storage.onChanged.addListener((changes) => {
  if (changes.timeoutSeconds) {
    timeoutSeconds = changes.timeoutSeconds.newValue;
  }
  if (changes.disableContextMenu) {
    disableContextMenu = changes.disableContextMenu.newValue;
  }
});

// Reset timer when content script notifies activity
browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg === "user-activity") {
    resetTimer(sender.tab.id);
  }
});

function resetTimer(tabId) {
  if (timer) clearTimeout(timer);

  timer = setTimeout(async () => {
    const home = await browser.browserSettings.homepageOverride.get({});
    const homeUrl = home.value;

    if (homeUrl) {
      browser.tabs.update(tabId, { url: homeUrl });
    }
  }, timeoutSeconds * 1000);
}
