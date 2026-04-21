const timeoutInput = document.getElementById("timeoutSeconds");
const disableContextMenuInput = document.getElementById("disableContextMenu");
const saveBtn = document.getElementById("save");

// Load existing settings
browser.storage.sync.get(["timeoutSeconds", "disableContextMenu"]).then((res) => {
  timeoutInput.value = res.timeoutSeconds ?? 60;
  disableContextMenuInput.checked = res.disableContextMenu ?? false;
});

// Save settings
saveBtn.addEventListener("click", () => {
  const timeoutSeconds = parseInt(timeoutInput.value, 10);

  browser.storage.sync.set({
    timeoutSeconds,
    disableContextMenu: disableContextMenuInput.checked
  });
});
