let disableContextMenu = false;

// Load initial settings
browser.storage.sync.get(["disableContextMenu"]).then((res) => {
  disableContextMenu = res.disableContextMenu ?? false;
  applyContextMenuSetting();
});

// Listen for settings changes
browser.storage.onChanged.addListener((changes) => {
  if (changes.disableContextMenu) {
    disableContextMenu = changes.disableContextMenu.newValue;
    applyContextMenuSetting();
  }
});

function applyContextMenuSetting() {
  if (disableContextMenu) {
    document.addEventListener("contextmenu", preventContextMenu, true);
  } else {
    document.removeEventListener("contextmenu", preventContextMenu, true);
  }
}

function preventContextMenu(e) {
  e.preventDefault();
}

// Send activity to background
function notifyActivity() {
  browser.runtime.sendMessage("user-activity").catch(() => {});
}

["mousemove", "keydown"].forEach((evt) => {
  window.addEventListener(evt, notifyActivity, { passive: true });
});
