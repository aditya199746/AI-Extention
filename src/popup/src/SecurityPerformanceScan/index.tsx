import React, { useState } from "react";
import { scanSecurityAndPerformance } from "../../../shared/SecurityPerformanceScanner";
import { saveSummary } from "../../../shared/StorageUtils"; // optionally save the report in storage

const SecurityPerformanceScan = () => {
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!code.trim()) {
      setReport("Please paste some code.");
      return;
    }
    setLoading(true);
    const result = await scanSecurityAndPerformance(code, language);
    setReport(result);
    saveSummary("code", result); // you could save these under a "code" or a new category
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔒 Security & Performance Scan</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Programming Language:{" "}
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ marginLeft: "10px"}}
          >
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C#">C#</option>
            <option value="C++">C++</option>
            <option value="Go">Go</option>
            <option value="Ruby">Ruby</option>
            <option value="PHP">PHP</option>
            {/* Add more languages as needed */}
          </select>
        </label>
      </div>
      
      <textarea 
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={8}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleScan}>Scan Code</button>
      
      {loading && <p>⏳ Processing scan...</p>}
      {report && (
        <div style={{ padding: "10px", background: "#f1f1f1", marginTop: "10px" }}>
          <strong>Scan Report:</strong>
          <p>{report}</p>
        </div>
      )}
    </div>
  );
};

export default SecurityPerformanceScan;