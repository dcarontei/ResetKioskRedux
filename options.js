const timeoutInput = document.getElementById("timeoutSeconds");
const disableContextMenuInput = document.getElementById("disableContextMenu");
const closeOtherTabsInput = document.getElementById("closeOtherTabsOnReset");
const saveBtn = document.getElementById("save");

// Load existing settings
browser.storage.sync.get([
  "timeoutSeconds",
  "disableContextMenu",
  "closeOtherTabsOnReset"
]).then((res) => {
  timeoutInput.value = res.timeoutSeconds ?? 60;
  disableContextMenuInput.checked = res.disableContextMenu ?? false;
  closeOtherTabsInput.checked = res.closeOtherTabsOnReset ?? false;
});

// Save settings
saveBtn.addEventListener("click", () => {
  const timeoutSeconds = parseInt(timeoutInput.value, 10);

  browser.storage.sync.set({
    timeoutSeconds,
    disableContextMenu: disableContextMenuInput.checked,
    closeOtherTabsOnReset: closeOtherTabsInput.checked
  });
});
