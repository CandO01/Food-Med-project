import React, { useState } from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, foodName }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!date || !time || !location) {
      alert('All fields are required');
      return;
    }
    onConfirm({ date, time, location });
    setDate('');
    setTime('');
    setLocation('');
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h3>Confirm Request for <span style={{ color: 'orange' }}>{foodName}</span></h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={modalStyles.input}
          placeholder="Delivery Date"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={modalStyles.input}
          placeholder="Delivery Time"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={modalStyles.input}
          placeholder="Pickup Location"
        />
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleSubmit} style={modalStyles.confirmBtn}>Confirm</button>
          <button onClick={onClose} style={modalStyles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.8rem',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  confirmBtn: {
    background: 'green',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    marginRight: '1rem',
    cursor: 'pointer'
  },
  cancelBtn: {
    background: 'gray',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    cursor: 'pointer'
  }
};

export default ConfirmModal;
