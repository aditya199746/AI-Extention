export const getPagePerformance = () => {
  const timing = performance.timing;
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;

  // Fallback for older browsers
  const navTiming = navigation || timing;

  return {
    unloadEventStart: navTiming.unloadEventStart,
    unloadEventEnd: navTiming.unloadEventEnd,
    redirectStart: navTiming.redirectStart,
    redirectEnd: navTiming.redirectEnd,
    fetchStart: navTiming.fetchStart,
    domainLookupStart: navTiming.domainLookupStart,
    domainLookupEnd: navTiming.domainLookupEnd,
    connectStart: navTiming.connectStart,
    connectEnd: navTiming.connectEnd,
    secureConnectionStart: navTiming.secureConnectionStart,
    requestStart: navTiming.requestStart,
    responseStart: navTiming.responseStart,
    responseEnd: navTiming.responseEnd,
    domLoading: timing.domLoading,
    domInteractive: timing.domInteractive,
    domContentLoadedEventStart: timing.domContentLoadedEventStart,
    domContentLoadedEventEnd: timing.domContentLoadedEventEnd,
    domComplete: timing.domComplete,
    loadEventStart: timing.loadEventStart,
    loadEventEnd: timing.loadEventEnd,
    totalLoadTime: timing.loadEventEnd - timing.navigationStart,
    resourcesLoaded: performance.getEntriesByType("resource").length,
  };
};

// ...existing code...

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_BLOG_CONTENT") {
    const article = document.querySelector("article");
    const extractedText = article ? article.innerText : document.body.innerText;
    sendResponse({ content: extractedText });
  }
  if (msg.type === "GET_PAGE_PERFORMANCE") {
    sendResponse({ metrics: getPagePerformance() });
  }
  // Return true to indicate async response
  return true;
});