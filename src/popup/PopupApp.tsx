import React, { Suspense, lazy, useState } from "react";
import SecurityPerformanceScan from "./src/SecurityPerformanceScan";
import CodeReview from "./src/CodeReview";
import PerformanceAudit from "./src/PerformanceAudit/PerformanceAudit";
import DOMAnalyzer from "./src/DOMAnalyzer";

const BlogSummary = lazy(() => import("./src/BlogSummary"));
const VideoSummary = lazy(() => import("./src/VideoSummary"));
const NewsSummary = lazy(() => import("./src/NewsSummary"));

const PopupApp = () => {
  const [activeTab, setActiveTab] = useState<"blog" | "video" | "news" | "code_review" | "performance"| "dom" | "security">("blog");

  return (
    <div style={{ padding: "20px" }}>
      <h2>📌 AI Summary Extension</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setActiveTab("blog")}>📜 Blog</button>
        <button onClick={() => setActiveTab("video")}>🎥 Video</button>
        <button onClick={() => setActiveTab("news")}>📰 News</button>
        <button onClick={() => setActiveTab("code_review")}>🛠 Code Review</button>
        <button onClick={() => setActiveTab("performance")}>🚀 Performance Audit</button>
        <button onClick={() => setActiveTab("dom")}>📄 DOM Optimization</button>
        <button onClick={() => setActiveTab("security")}>🔒 Security Scan</button>

      </div>

      <Suspense fallback={<p>Loading...</p>}>
        {activeTab === "blog" && <BlogSummary />}
        {activeTab === "video" && <VideoSummary />}
        {activeTab === "news" && <NewsSummary />}
        {activeTab === "code_review" && <CodeReview  />}
        {activeTab === "performance" && <PerformanceAudit  />}
        {activeTab === "dom" && <DOMAnalyzer  />}
        {activeTab === "security" && <SecurityPerformanceScan />}
      </Suspense>
    </div>
  );
};

export default PopupApp;