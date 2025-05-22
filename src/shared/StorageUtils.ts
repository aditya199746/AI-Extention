export const saveSummary = async (type: "blog" | "video" | "news" | "code", summary: string) => {
  const storedSummaries = (await chrome.storage.local.get([type]))[type] || [];
  storedSummaries.push({ timestamp: Date.now(), summary });

  chrome.storage.local.set({ [type]: storedSummaries });
};

export const getSummaryHistory = async (type: "blog" | "video" | "news" | "code") => {
  const data = await chrome.storage.local.get([type]);
  return data[type] || [];
};