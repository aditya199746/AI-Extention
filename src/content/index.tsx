import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const BUTTON_SIZE = 50;
const MARGIN = 20;

const FloatingButton = () => {
  const [position, setPosition] = useState({ top: window.innerHeight - BUTTON_SIZE - MARGIN, left: window.innerWidth - BUTTON_SIZE - MARGIN });
  const [dragging, setDragging] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      let newLeft = e.clientX - offset.current.x;
      let newTop = e.clientY - offset.current.y;

      // Keep within window bounds
      newLeft = Math.max(0, Math.min(window.innerWidth - BUTTON_SIZE, newLeft));
      newTop = Math.max(0, Math.min(window.innerHeight - BUTTON_SIZE, newTop));

      setPosition({ left: newLeft, top: newTop });
    };

    const handleMouseUp = () => {
      if (!dragging) return;
      setDragging(false);

      // Snap to nearest border
      const { left, top } = position;
      const right = window.innerWidth - left - BUTTON_SIZE;
      const bottom = window.innerHeight - top - BUTTON_SIZE;

      const minDist = Math.min(left, right, top, bottom);
      let snapLeft = left, snapTop = top;

      if (minDist === left) snapLeft = MARGIN;
      else if (minDist === right) snapLeft = window.innerWidth - BUTTON_SIZE - MARGIN;
      else if (minDist === top) snapTop = MARGIN;
      else if (minDist === bottom) snapTop = window.innerHeight - BUTTON_SIZE - MARGIN;

      setPosition({ left: snapLeft, top: snapTop });
    };

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, position]);

  // Optional: update position on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(pos => ({
        left: Math.min(pos.left, window.innerWidth - BUTTON_SIZE - MARGIN),
        top: Math.min(pos.top, window.innerHeight - BUTTON_SIZE - MARGIN),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  window.addEventListener("message", (event) => {
  if (event.data?.type === "CLOSE_AI_PANEL") {
    const iframe = document.getElementById("ai-popup");
    if (iframe) {
      setPopupVisible(false)
    }
  }
});

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: position.left,
          top: position.top,
          width: `${BUTTON_SIZE}px`,
          height: `${BUTTON_SIZE}px`,
          backgroundColor: "#0078D4",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "20px",
          cursor: dragging ? "grabbing" : "grab",
          zIndex: 9999,
          userSelect: "none",
          animation: "heartbeat 1.2s infinite",
          boxShadow: "0 0 0 0 rgba(0,120,212,0.7)",
        }}
        onMouseDown={handleMouseDown}
        onClick={togglePopup}
      >
        AI
      </div>
      {isPopupVisible && (
        <iframe
        src={chrome.runtime.getURL("popup/index.html")}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "400px",
          height: "100vh",
          border: "none",
          backgroundColor: "white",
          boxShadow: "-4px 0 16px rgba(0,0,0,0.2)",
          borderRadius: "0",
          zIndex: 9999,
          transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
          transform: isPopupVisible ? "translateX(0)" : "translateX(100%)",
          overflow: "hidden",
        }}
        id="ai-popup"
      />
      )}
    </>
  );
};

// Prevent duplicate injection
const existing = document.getElementById('floating-container');
if (existing) existing.remove();

const container = document.createElement("div");
container.id = "floating-container";
document.body.appendChild(container);
const root = createRoot(container);
root.render(<FloatingButton />);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_BLOG_CONTENT") {
    const article = document.querySelector("article");
    const extractedText = article ? article.innerText : document.body.innerText;
    sendResponse({ content: extractedText });
  }
  // Return true to indicate async response
  return true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyze_dom") {
    try {
      const { loadEventEnd, navigationStart } = performance.timing;
      const pageLoadTime = loadEventEnd - navigationStart;

      const resourceTimings = performance.getEntriesByType("resource").map((entry) => ({
        name: entry.name,
        duration: entry.duration,
      }));

      // Send the response asynchronously
      sendResponse({
        pageLoadTime: `${pageLoadTime}ms`,
        networkRequests: resourceTimings,
        domElementsCount: document.getElementsByTagName("*").length,
      });
    } catch (error) {
      console.error("Error processing DOM analysis:", error);
      sendResponse({ error: "⚠ Error analyzing the DOM performance." });
    }
    
    return true; // Explicitly indicate an asynchronous response
  }
});
