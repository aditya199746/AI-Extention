import axios from "axios";
import data from "../../../keys.json"
const GEMINI_API_KEY = data.googleapis; // Replace with your actual API key

/**
 * scanSecurityAndPerformance: Uses Gemini AI to analyze a code snippet for security vulnerabilities
 * and performance issues.
 * @param codeSnippet - The code to be analyzed.
 * @param language - The programming language context (e.g., "JavaScript", "Python").
 * @returns The AI-generated analysis report.
 */
export const scanSecurityAndPerformance = async (codeSnippet: string, language: string) => {
  // Construct a prompt that instructs Gemini to provide a deep analysis
  const prompt = `Please analyze the following ${language} code snippet for security vulnerabilities and performance issues. Identify potential security risks, highlight performance bottlenecks, and suggest improvements or auto-fixes if possible.

Code:
${codeSnippet}

Provide a detailed report with recommendations.`;

  try {
    const response = await axios.post(
      "https://api.vertexai.googleapis.com/v1/models/gemini:predict",
      {
        instances: [{ prompt }],
        parameters: { temperature: 0.6 }
      },
      {
        headers: { Authorization: `Bearer ${GEMINI_API_KEY}` }
      }
    );
    return response.data.predictions[0].content;
  } catch (error) {
    console.error("Security & Performance Scan Error:", error);
    return "⚠ Error during security and performance scan.";
  }
};

/**
 * analyzeWithGemini accepts a prompt and returns Gemini's analysis.
 */
export const analyzeWithGemini = async (prompt: string) => {
  try {
    const response = await axios.post(
      "https://api.vertexai.googleapis.com/v1/models/gemini:predict",
      {
        instances: [{ prompt }],
        parameters: { temperature: 0.6 }
      },
      {
        headers: { Authorization: `Bearer ${GEMINI_API_KEY}` }
      }
    );
    return response.data.predictions[0].content;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "⚠ AI Analysis Failed.";
  }
};

// Review code – using a refined prompt for code review.
export const reviewCode = async (codeSnippet: string) =>
  analyzeWithGemini(
    `Please review the following code snippet for coding best practices, potential security vulnerabilities, and performance issues. Provide your analysis with suggestions for improvement:\n\n${codeSnippet}`
  );

// Analyze performance – using refined prompt to analyze page performance logs.
export const analyzePerformance = async (performanceLogs: string) =>
  analyzeWithGemini(
    `Evaluate the following website performance data. Identify bottlenecks, memory issues, and recommend optimizations:\n\n${performanceLogs}`
  );

// Optimize DOM – using refined prompt to suggest improvements in DOM structure.
export const optimizeDOM = async (domSnapshot: string) =>
  analyzeWithGemini(
    `Analyze the following DOM snippet to identify inefficiencies and suggest improvements for better rendering performance and maintainability:\n\n${domSnapshot}`
  );