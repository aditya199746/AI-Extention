import React, { useState } from "react";
import { optimizeDOM } from "../../../shared/SecurityPerformanceScanner";

const DOMAnalyzer = () => {
  const [domReport, setDomReport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyzeDOM = async () => {
    setLoading(true);
    // Capture a small section of the DOM for analysis.
    const domSnapshot = document.documentElement.innerHTML.slice(0, 2000);
    const report = await optimizeDOM(domSnapshot);
    setDomReport(report);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📄 DOM Optimization</h2>
      <button onClick={handleAnalyzeDOM}>Optimize DOM</button>
      {loading && <p>Optimizing DOM, please wait…</p>}
      {domReport && (
        <div style={{ marginTop: "10px", background: "#f1f1f1", padding: "10px" }}>
          <strong>DOM Analysis Report:</strong>
          <p>{domReport}</p>
        </div>
      )}
    </div>
  );
};

export default DOMAnalyzer;