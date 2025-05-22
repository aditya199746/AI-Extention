import React, { useState } from "react";
import { analyzePerformance } from "../../../shared/SecurityPerformanceScanner";
import { getPagePerformance } from "../../../content/getPagePerformance";

const PerformanceAudit = () => {
  const [performanceReport, setPerformanceReport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyzePerformance = async () => {
    setLoading(true);
    // Capture performance metrics from the page.
    const metrics = getPagePerformance();
    const report = await analyzePerformance(`${metrics}`);
    setPerformanceReport(report);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚀 Performance Audit</h2>
      <button onClick={handleAnalyzePerformance}>Analyze Performance</button>
      {loading && <p>Analyzing performance...</p>}
      {performanceReport && (
        <div style={{ marginTop: "10px", background: "#f1f1f1", padding: "10px" }}>
          <strong>Performance Report:</strong>
          <p>{performanceReport}</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceAudit;