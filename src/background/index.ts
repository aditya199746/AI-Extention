chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Ensure page has fully loaded
  if (changeInfo.status === "complete" && tab.url && /^https?:\/\//.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.bundle.js"]
    }).catch(error => console.error("Script injection failed:", error));
  }
});