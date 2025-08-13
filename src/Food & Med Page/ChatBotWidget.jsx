import React, { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa"; // npm install react-icons
import AskAI from "../Food & Med Page/AskAI";

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Floating Robot Icon */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "50px",
            right: "20px",
            background: "orange",
            color: "black",
            borderRadius: "50%",
            padding: "14px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
            cursor: "pointer",
            zIndex: 1000,
            animation: "bounce 1.5s infinite",
          }}
        >
          <FaRobot size={28} />
        </div>
      )}

      {/* Chatbox */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "350px",
            height: "500px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0px 6px 15px rgba(0,0,0,0.25)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "slideUp 0.3s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "orange",
              color: "black",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            FoodMed AI Assistant
            <FaTimes
              style={{ cursor: "pointer" }}
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Chat Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
            <AskAI />
          </div>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-8px); }
            60% { transform: translateY(-4px); }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
