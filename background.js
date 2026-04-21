let timeoutSeconds = 1200;
let disableContextMenu = false;
let closeOtherTabsOnReset = false;
let timer = null;

// Load settings on startup
browser.storage.sync.get([
  "timeoutSeconds",
  "disableContextMenu",
  "closeOtherTabsOnReset"
]).then((res) => {
  timeoutSeconds = res.timeoutSeconds ?? 1200;
  disableContextMenu = res.disableContextMenu ?? false;
  closeOtherTabsOnReset = res.closeOtherTabsOnReset ?? false;
});

// Listen for settings changes
browser.storage.onChanged.addListener((changes) => {
  if (changes.timeoutSeconds) {
    timeoutSeconds = changes.timeoutSeconds.newValue;
  }
  if (changes.disableContextMenu) {
    disableContextMenu = changes.disableContextMenu.newValue;
  }
  if (changes.closeOtherTabsOnReset) {
    closeOtherTabsOnReset = changes.closeOtherTabsOnReset.newValue;
  }
});

// Reset timer when content script notifies activity
browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg === "user-activity") {
    //console.log("resetting timer");
    resetTimer(sender.tab.id);
  }
});

function resetTimer(tabId) {
  if (timer) clearTimeout(timer);

  timer = setTimeout(async () => {
    // console.log("timer expired");

    const home = await browser.browserSettings.homepageOverride.get({});
    const homeUrl = home.value;
    //console.log("home is ", homeUrl);

    if (homeUrl) {
      await browser.tabs.update(tabId, { url: homeUrl });
    }

    if (closeOtherTabsOnReset) {
      const allTabs = await browser.tabs.query({});
      for (const tab of allTabs) {
        if (tab.id !== tabId) {
          browser.tabs.remove(tab.id);
        }
      }
    }
  }, timeoutSeconds * 1000);
}
