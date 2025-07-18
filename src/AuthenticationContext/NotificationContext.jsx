// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const NotificationContext = createContext();
const socket = io("https://foodmed-server3.onrender.com");

export const NotificationProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const location = useLocation();

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      const isOnChatPage = location.pathname.includes("/chat") && location.pathname.includes(msg.senderId);
      if (!isOnChatPage) {
        setToast({
          senderId: msg.senderId,
          text: msg.text
        });
        setHasNewMessage(true);
        setTimeout(() => setToast(null), 5000);
      }
    });

    return () => socket.off("receiveMessage");
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith("/chat")) {
      setHasNewMessage(false);
    }
  }, [location]);

      const showToast = ({ text }) => {
      setToast({ text });

      setTimeout(() => {
        setToast(null);
      }, 3000); // Auto-hide after 3 seconds
    };


  return (
    <NotificationContext.Provider value={{ toast, showToast, hasNewMessage, setHasNewMessage }}>
      {toast && (
        <div style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: 'white',
          padding: '10px 20px',
          borderRadius: 10,
          zIndex: 999
        }}>
          💬 New message: {toast.text}
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
