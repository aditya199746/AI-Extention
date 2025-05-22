import React, { useEffect, useState } from "react";
import { summarizeText } from "../../../shared/APIUtils";
import { getSummaryHistory, saveSummary } from "../../../shared/StorageUtils";

const BlogSummary = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ timestamp: number; summary: string }[]>([]);
  const [blogContent, setBlogContent] = useState("");

  useEffect(() => {
    getSummaryHistory("blog").then(setHistory);
  }, []);

  const handleSummarize = async () => {
    setLoading(true);
    // const pageText = document.body.innerText; // Extracts blog text

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id!, { type: "GET_BLOG_CONTENT" });
    const extractedText = response?.content || "";
    setBlogContent(extractedText);



    const generatedSummary = await summarizeText(extractedText,"blog");

    setSummary(generatedSummary);
    saveSummary("blog", generatedSummary);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📜 AI Blog Summarization</h2>
      <button onClick={handleSummarize}>✨ Summarize Blog Content</button>

      {loading && <p>⏳ Processing...</p>}
      {summary && (
        <div style={{ padding: "10px", background: "#f1f1f1", marginTop: "10px" }}>
          <strong>🔍 Summary:</strong>
          <p>{summary}</p>
        </div>
      )}

      <h3>📌 Summary History</h3>
      {history.length === 0 ? (
        <p>No past summaries available.</p>
      ) : (
        history.map((entry, index) => (
          <div key={index} style={{ padding: "10px", background: "#eee", marginTop: "5px" }}>
            <strong>{new Date(entry.timestamp).toLocaleString()}</strong>
            <p>{entry.summary}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BlogSummary;