import React from 'react'
import { useNotification } from '../AuthenticationContext/NotificationContext'


const Header = () => {
  const { toast } = useNotification(); 

  return (
    <header style={{ position: "relative", zIndex: 100 }}>
      {toast && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          animation: 'slideDown 0.3s ease-in-out'
        }}>
          💬 {toast.text}
        </div>
      )}
    </header>
  );
};

export default Header;
