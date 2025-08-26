// src/components/LoadingDots.jsx
import React, { useEffect } from "react";

const LoadingDots = ({ color = "#4CAF50", size = 10, center = false }) => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: center ? "center" : "flex-start",
      alignItems: "center",
      height: center ? "100vh" : "auto"
    }}>
      <span style={{ display: "flex", gap: size / 2 }}>
        {[0, 0.3, 0.6].map((delay, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: "50%",
              animation: "bounce 1.2s infinite ease-in-out",
              animationDelay: `${delay}s`
            }}
          />
        ))}
      </span>
    </div>
  );
};

export default LoadingDots;
