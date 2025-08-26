// components/RequestModal.jsx

import React, { useState } from 'react';

const RequestModal = ({ item, onClose, onSubmit }) => {
  if (!item) return null;
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!phone.trim()) return; // Prevent submission if phone is empty
    // Prepare the payload for the parent handler

  const userId = localStorage.getItem('userId') || "";
  const userEmail = localStorage.getItem('email') || "";
  const userName = localStorage.getItem('name') || "";

const requestPayload = {
  ...item,
  phone,
  donorId: item.donorId ? String(item.donorId) : null,  // always a string or null
  donorEmail: item.donorEmail || null,
  donorName: item.donorName || null,
  userId,
  userEmail,
  userName
};

    // Call the onSubmit function passed as a prop
    if (onSubmit) onSubmit(requestPayload);
    onClose();
  };



  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3  style={styles.request}>Request {item.foodName}</h3>
        <label style={styles.request}>Enter your phone number</label>
        <input
          type="number"
          placeholder="Enter your phone number..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
          required
        />
        <div style={styles.actions}>
          <button 
            onClick={handleSubmit}
            disabled={!phone.trim()}
            style={{
              backgroundColor: !phone.trim() ? '#ccc' : '#4ac505',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: !phone.trim() ? 'not-allowed' : 'pointer'
            }}
            >Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 9999
  },
  modal: {
    background: '#fff', padding: '20px', borderRadius: '8px', width: '300px'
  },
  input: {
    width: '100%', padding: '8px', marginTop: '10px', marginBottom: '20px'
  },
  actions: {
    display: 'flex', justifyContent: 'space-between'
  },
  request:{
    color: 'black'
  }
};

export default RequestModal;
