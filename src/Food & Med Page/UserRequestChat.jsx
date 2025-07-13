import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('http://localhost:3001/requests');
        const all = await res.json();
        const mine = all.filter(r => r.email === userEmail);
        setRequests(mine);
      } catch (error) {
        console.error('Failed to load requests:', error);
      }
    };

    fetchRequests();
  }, [userEmail]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Requests</h2>
      {requests.length === 0 ? (
        <p>You haven’t made any requests yet.</p>
      ) : (
        requests.map((req, idx) => (
          <div key={idx} style={styles.card}>
            <h3>{req.foodName}</h3>
            <p><strong>Status:</strong> 
              <span style={{ color: req.status === 'confirmed' ? 'green' : 'orange' }}>
                {req.status}
              </span>
            </p>

            {req.donorEmail && (
              <Link
                to={`/chat/${req.donorEmail}`}
                onClick={() => {
                  localStorage.setItem('lastRecipientId', req.donorEmail);
                }}
              >
                <button style={styles.chatBtn}>💬 Chat with Donor</button>
              </Link>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    background: '#f9f9f9'
  },
  chatBtn: {
    background: 'orange',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    marginTop: '0.5rem'
  }
};

export default UserRequests;
