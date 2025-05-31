import React, { useState } from "react";
import { Video, RefreshCw, Link } from "lucide-react";

const VideoSummarization: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [language, setLanguage] = useState("en");

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
  ];

  const handleSummarize = async () => {
    if (!videoUrl) return;

    setIsLoading(true);
    setSummary(null);

    try {
      // In a real implementation, this would extract video content and use a Hugging Face model
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setSummary(
        "This video discusses the latest advancements in artificial intelligence and machine learning. It covers topics such as transformer models, reinforcement learning, and generative AI. The presenter demonstrates several practical examples of how these technologies can be applied in real-world scenarios, including content summarization, code analysis, and image editing."
      );
    } catch (error) {
      console.error("Error summarizing video:", error);
      setSummary("Error generating summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the current page has YouTube video
  const getCurrentVideo = () => {
    // In a real implementation, this would detect YouTube videos on the page
    const url = window.location.href;
    if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
      setVideoUrl(url);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div>
          <div>Video Summarization</div>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Get concise summaries of video content in your preferred language.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter YouTube URL"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button onClick={getCurrentVideo}>Current</button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Output Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="w-full"
            disabled={!videoUrl}
          >
            <Video size={18} className="mr-2" />
            Summarize Video
          </button>
        </div>
      </div>

      {summary && (
        <div className="mt-4 bg-gray-50">
          <div>
            <div>Video Summary</div>
          </div>
          <div>
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {summary}
            </p>
          </div>
          <div>
            <button className="ml-auto" onClick={handleSummarize}>
              <RefreshCw size={14} className="mr-1" />
              Regenerate
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-sm text-gray-500 mt-2">
            Analyzing video content...
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoSummarization;
