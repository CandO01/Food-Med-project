// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { AuthContext } from "../AuthenticationContext/Authcontext";
import notifification from '../assets/notification.mp3.mp3'

const NotificationContext = createContext();
const socket = io("https://foodmed-server3.onrender.com");

export const NotificationProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔌 Log socket connection
  useEffect(() => {
    socket.on("connect", () => {
    });
  }, []);

  // 📢 Join socket room with user ID (which is email)
  useEffect(() => {
    if (user && user?._id) {

      socket.emit("joinNotificationRoom", user._id);
    }
  }, [user]);

  // 📩 Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (msg) => {


    if(!user) return
    if(msg.recipientId !==user?._id) return 
      const isOnChatPage = location.pathname === `/chat/${msg.senderId}`;
      // console.log("isOnChatPage:", isOnChatPage);

      if (!isOnChatPage) {
        setToast({ 
          senderId: msg.senderId, 
          senderName: msg.senderName || "Someone",
          text: msg.text 
        });

        const audio = new Audio(notifification);
        audio.play().catch((error) => {
          console.error("Error playing notification sound:", error);
        });
        // 🛎️ Set new message badge
        setHasNewMessage(true);

        setTimeout(() => setToast(null), 5000);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [user, location]);

  // 🧹 Clear new message badge if user visits /chat/*
  useEffect(() => {
    if (location.pathname.startsWith("/chat")) {
      setHasNewMessage(false);
    }
  }, [location]);

  const showToast = ({ text }) => {
    setToast({ text });
    setTimeout(() => setToast(null), 13000);
  };

  return (
    <NotificationContext.Provider value={{ toast, showToast, hasNewMessage, setHasNewMessage, socket }}>
      {toast && (
        <div 
          onClick={() => navigate(`/chat/${toast.senderId}`)}
          style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'lightgreen',
          color: '#black',
          padding: '10px 20px',
          textAlign: 'center',
          width:'100%',
          zIndex: 9999
        }}>
          <strong>{toast.senderName}</strong>: {toast.text}
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
