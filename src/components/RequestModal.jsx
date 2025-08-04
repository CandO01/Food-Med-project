// components/RequestModal.jsx
import { color } from 'framer-motion';
import React, { useState } from 'react';

const RequestModal = ({ item, onClose, onSubmit }) => {
  if (!item) return null;
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (onSubmit) onSubmit(item);
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
          <button onClick={handleSubmit}>Submit</button>
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
