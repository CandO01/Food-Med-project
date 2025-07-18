// src/components/UpdateNoticeModal.jsx
import React, { useEffect, useState } from "react";

const UpdateNoticeModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem("hasSeenUpdateNotice");
    if (hasSeenNotice) return;

    const userLang = navigator.language || navigator.userLanguage;

    if (userLang.startsWith("yo")) {
      setMessage(`A ti ṣe awọn ayipada pataki ninu app yi.\n\n
Tó bá jẹ́ pé app náà kò ń ṣiṣẹ́ dáadáa:\n
- Jọwọ sọfitiwia (cache) browser rẹ di mimọ,\n
- Tabi lo Incognito/Private mode ki o to wọlé.`);
    } else if (userLang.startsWith("pcm") || userLang.startsWith("en-NG") || userLang.includes("pidgin")) {
      setMessage(`We don do some important updates for dis app.\n\n
If e dey slow or no load well:\n
- Clear your browser cache, or\n
- Use Incognito/Private mode make e work well.`);
    } else {
      setMessage(`We've made important updates to this app.\n\n
If it's not loading correctly:\n
- Clear your browser cache, or\n
- Use Incognito/Private mode for a better experience.`);
    }

    setShowModal(true);
    localStorage.setItem("hasSeenUpdateNotice", "true");
  }, []);

  if (!showModal) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.header}>Notice</h2>
        <p style={styles.message}>{message}</p>
        <button onClick={() => setShowModal(false)} style={styles.button}>
          Got it
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
  header: {
    marginBottom: "10px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    whiteSpace: "pre-line",
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#444",
  },
  button: {
    marginTop: "20px",
    padding: "10px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default UpdateNoticeModal;
