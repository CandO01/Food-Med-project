import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // adjust if hosted elsewhere

const DonorProfile = () => {
  const [foodItems, setFoodItems] = useState([]);
  const donorEmail = localStorage.getItem('donorEmail');

  useEffect(() => {
    fetchData();
    return () => socket.disconnect();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3001/submissions');
      const allItems = await res.json();
      const donorItems = allItems.filter(item => item.donorEmail === donorEmail);

      const reqRes = await fetch('http://localhost:3001/requests');
      const allRequests = await reqRes.json();

      const itemsWithRequests = donorItems.map(item => {
        const requestsForItem = allRequests.filter(r => r.foodName === item.foodName);
        return { ...item, requests: requestsForItem };
      });

      setFoodItems(itemsWithRequests);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const confirmRequest = async (reqId) => {
    const date = prompt('Enter delivery date');
    const time = prompt('Enter delivery time');
    const location = prompt('Enter pickup location');

    if (!date || !time || !location) {
      alert('All fields are required');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/request/update/${reqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, location })
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      console.error('Failed to confirm request:', err);
    }
  };

  const rejectRequest = async (reqId) => {
    if (!window.confirm('Are you sure to reject?')) return;
    try {
      const res = await fetch(`http://localhost:3001/request/delete/${reqId}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Link to='/food-form' style={styles.backLink}><IoArrowBack /> Back to Food Form</Link>
      <h2 style={styles.heading}>Donor Profile & Requests</h2>

      {foodItems.length === 0 ? (
        <p>No food requests yet.</p>
      ) : (
        foodItems.map((item, index) => (
          <div key={index} style={styles.card}>
            <h3>{item.foodName}</h3>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Mode:</strong> {item.mode}</p>
            <p><strong>Expiry:</strong> {item.expiryDate}</p>

            <h4 style={{ marginTop: '1rem' }}>User Requests:</h4>
            {item.requests.length === 0 ? (
              <p style={{ color: 'gray' }}>No requests.</p>
            ) : (
              <ul style={styles.list}>
                {item.requests.map((req, idx) => (
                  <li key={idx} style={styles.requestItem}>
                    <p><strong>Email:</strong> {req.email}</p>
                    <p><strong>Status:</strong>
                      <span style={{
                        color: req.status === 'confirmed' ? 'green' : 'orange',
                        fontWeight: 'bold',
                        marginLeft: '0.5rem'
                      }}>{req.status}</span>
                    </p>

                    {req.status !== 'confirmed' && (
                      <div style={styles.buttonGroup}>
                        <button style={styles.confirmBtn} onClick={() => confirmRequest(req.id)}>✅ Confirm</button>
                        <button style={styles.rejectBtn} onClick={() => rejectRequest(req.id)}>❌ Reject</button>
                      </div>
                    )}

                    <Link
                      to={`/chat/${req.email}`}
                      onClick={() => localStorage.setItem('lastRecipientId', req.email)}
                    >
                      <button style={styles.chatBtn}>💬 Chat with User</button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  backLink: {
    textDecoration: 'none',
    color: 'orange',
    marginBottom: '1rem',
    display: 'inline-block'
  },
  heading: {
    marginBottom: '1rem'
  },
  card: {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    background: '#f9f9f9'
  },
  requestItem: {
    marginTop: '1rem',
    padding: '0.8rem',
    backgroundColor: '#fff',
    borderRadius: '5px',
    border: '1px solid #ddd'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem'
  },
  confirmBtn: {
    backgroundColor: 'green',
    color: 'white',
    padding: '0.4rem 0.8rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  rejectBtn: {
    backgroundColor: 'red',
    color: 'white',
    padding: '0.4rem 0.8rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  chatBtn: {
    marginTop: '0.5rem',
    padding: '0.4rem 0.8rem',
    border: 'none',
    background: 'orange',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default DonorProfile;
