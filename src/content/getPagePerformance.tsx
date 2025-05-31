chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyze_dom") {
    try {
      const { loadEventEnd, navigationStart } = performance.timing;
      const pageLoadTime = loadEventEnd - navigationStart;

      const resourceTimings = performance.getEntriesByType("resource").map((entry) => ({
        name: entry.name,
        duration: entry.duration,
      }));

      // Extract DOM from the active webpage (not the popup iframe)
      const domSnapshot = document.documentElement.innerHTML.slice(0, 3000);

      sendResponse({
        pageLoadTime: `${pageLoadTime}ms`,
        networkRequests: resourceTimings,
        domElementsCount: document.getElementsByTagName("*").length,
        domSnapshot, // Include the extracted DOM snapshot
      });
    } catch (error) {
      console.error("Error processing DOM analysis:", error);
      sendResponse({ error: "⚠ Error analyzing the DOM performance." });
    }
    
    return true; // Required for async response handling
  }
});