const monitorDOMPerformance = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`Type: ${entry.entryType}, Name: ${entry.name}, Duration: ${entry.duration}ms`);
    });
  });

  observer.observe({ entryTypes: ["layout-shift", "longtask", "measure"] });

  document.addEventListener("DOMSubtreeModified", () => {
    console.log("DOM Updated: Possible reflow detected.");
  });
};

export default monitorDOMPerformance;