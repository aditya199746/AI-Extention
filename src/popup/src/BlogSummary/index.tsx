import React, { useEffect, useState } from "react";
import { summarizeBlog } from "../../../shared/APIUtils";
import { getSummaryHistory, saveSummary } from "../../../shared/StorageUtils";
import { FileText, RefreshCw } from "lucide-react";
import styles from "./BlogSummarization.module.scss";

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
];

const BlogSummary = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { timestamp: number; summary: string }[]
  >([]);
  const [blogContent, setBlogContent] = useState("");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    getSummaryHistory("blog").then(setHistory);
  }, []);

  const handleSummarize = async () => {
    setLoading(true);
    // const pageText = document.body.innerText; // Extracts blog text

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id!, {
      type: "GET_BLOG_CONTENT",
    });
    const extractedText = response?.content || "";
    setBlogContent(extractedText);

    const generatedSummary = await summarizeBlog(extractedText); //summarizeText(extractedText,"blog");

    setSummary(generatedSummary);
    saveSummary("blog", generatedSummary);
    setLoading(false);
  };

  return (
    // <div style={{ padding: "20px" }}>
    //   <h2>📜 AI Blog Summarization</h2>
    //   <button onClick={handleSummarize}>✨ Summarize Blog Content</button>

    //   {loading && <p>⏳ Processing...</p>}
    //   {summary && (
    //     <div style={{ padding: "10px", background: "#f1f1f1", marginTop: "10px" }}>
    //       <strong>🔍 Summary:</strong>
    //       <p>{summary}</p>
    //     </div>
    //   )}

    //   <h3>📌 Summary History</h3>
    //   {history.length === 0 ? (
    //     <p>No past summaries available.</p>
    //   ) : (
    //     history.map((entry, index) => (
    //       <div key={index} style={{ padding: "10px", background: "#eee", marginTop: "5px" }}>
    //         <strong>{new Date(entry.timestamp).toLocaleString()}</strong>
    //         <p>{entry.summary}</p>
    //       </div>
    //     ))
    //   )}
    // </div>
    <div className={styles.root}>
      <div className={styles.card}>
        <div>
          <div className={styles.title}>Blog Summarization</div>
        </div>
        <div>
          <p className={styles.subtitle}>
            Quickly summarize the content of any blog or article on the current
            page.
          </p>
          <div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSummarize}
            // isLoading={loading}
            className="w-full"
          >
            <FileText size={18} style={{ marginRight: 8 }} />
            Summarize Current Page
          </button>
        </div>
      </div>

      {summary && (
        <div className={styles.summaryCard}>
          <div>
            <div>Summary</div>
          </div>
          <div>
            <p className={styles.summaryText}>{summary}</p>
          </div>
          <div>
            <button
              // variant="outline"
              // size="sm"
              className="ml-auto"
              onClick={handleSummarize}
            >
              <RefreshCw size={14} style={{ marginRight: 4 }} />
              Regenerate
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.spinnerWrap}>
          {/* <Spinner size="lg" /> */}
          <p className={styles.analyzingText}>Analyzing content...</p>
        </div>
      )}
    </div>
  );
};

export default BlogSummary;
