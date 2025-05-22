import React, { useState } from "react";
import { reviewCode } from "../../../shared/SecurityPerformanceScanner";

const CodeReview = () => {
  const [code, setCode] = useState("");
  const [reviewResult, setReviewResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReviewCode = async () => {
    if (!code.trim()) {
      alert("Please paste some code to review.");
      return;
    }
    setLoading(true);
    const result = await reviewCode(code);
    setReviewResult(result);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛠 AI Code Review</h2>
      <textarea
        placeholder="Paste your code here for a detailed review..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={6}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleReviewCode}>Review Code</button>
      {loading && <p>Reviewing code, please wait…</p>}
      {reviewResult && (
        <div style={{ marginTop: "10px", background: "#f1f1f1", padding: "10px" }}>
          <strong>Review Report:</strong>
          <p>{reviewResult}</p>
        </div>
      )}
    </div>
  );
};

export default CodeReview;