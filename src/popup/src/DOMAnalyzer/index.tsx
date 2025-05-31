import React, { useState } from "react";
import { optimizeDOM } from "../../../shared/SecurityPerformanceScanner";


const DOMAnalyzer = () => {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyzeDOM = async () => {
    setLoading(true);

    // Query the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "analyze_dom" }, async (response) => {
          if (chrome.runtime.lastError) {
            setReport(`⚠ Error: ${chrome.runtime.lastError.message}`);
            setLoading(false);
            return;
          }
          if (!response || response.error) {
            setReport(response?.error || "⚠ No response received from content script.");
            setLoading(false);
            return;
          }

          interface NetworkRequest {
            name: string;
            duration: number;
          }

          interface AnalyzeDomResponse {
            pageLoadTime: string;
            domElementsCount: number;
            networkRequests: NetworkRequest[];
            domSnapshot: string; // Now receiving the DOM snapshot from the content script
          }

          const typedResponse = response as AnalyzeDomResponse;

          // Send extracted DOM snapshot and performance metrics to Gemini AI
          const aiOptimizationReport = await optimizeDOM(typedResponse.domSnapshot, typedResponse);

          const formattedReport = `
⏳ Page Load Time: ${typedResponse.pageLoadTime}
📜 Total DOM Elements: ${typedResponse.domElementsCount}
🔗 Network Requests:
${typedResponse.networkRequests.map((req) => req.name + " (" + req.duration.toFixed(2) + "ms)").join("\n")}
  
🔍 **AI Optimization Suggestions**:
${aiOptimizationReport}
          `;

          setReport(formattedReport);
          setLoading(false);
        });
      } else {
        setReport("⚠ No active tab found.");
        setLoading(false);
      }
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📄 AI-Powered DOM Audit</h2>
      <button onClick={handleAnalyzeDOM}>🔍 Audit Website DOM</button>
      {loading && <p>⏳ Processing audit...</p>}
      {report && (
        <div style={{ padding: "10px", background: "#f1f1f1", marginTop: "10px", whiteSpace: "pre-wrap" }}>
          <strong>Optimization Report:</strong>
          <p>{report}</p>
        </div>
      )}
    </div>
  );
};

export default DOMAnalyzer;