// src/components/UserRequests.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../AuthenticationContext/Authcontext';

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false)
  const location = useLocation();
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const canRequest = localStorage.getItem('canRequest') === 'true';
        const canDonate = localStorage.getItem('canDonate') === 'true';

      let type = '';
      if (canRequest && canDonate) {
        type = 'both';
      } else if (canRequest) {
        type = 'user';
      } else if (canDonate) {
        type = 'donor';
      } else {
        console.error('User has neither canRequest nor canDonate permission.');
        return;
      }



    if (!userId) {
      console.error('User ID is missing from localStorage');
      return;
    }
    // Fetch requests based on userId and type

    const response = await fetch(`https://foodmed-server3.onrender.com/requests?id=${userId}&type=${type}`);
    const data = await response.json();
    console.log('Fetched requests:', data);

    if (!Array.isArray(data)) {
      console.error('Unexpected data format:', data);
      return;
    }

    // const userRequests = data.filter(req =>
    //   req.userId === userId || req.donorId === userId
    // );
    // setRequests(userRequests);
    setRequests(data)
    console.log(data)
  } catch(error) {
    console.error('Error fetching requests:', error);
  }
  finally {
        setLoading(false);
      }
}

    fetchRequests();
  }, [location]); // Re-fetch when location changes

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Requests</h2>
      {loading ? (
        <div className="spinner"></div> //the css is in the universal file /App.css
      ) : (
        requests.length === 0 ? (
          <p>You haven’t made any requests yet.</p>
        ) : (
          requests.map((req, idx)=> (
            <div key={idx} style={styles.card}>
              <h3 style={{color: 'black'}}>{req.foodName}</h3>
              <p style={{color: 'black'}}>
                <strong>Status:</strong>{' '}
                <span style={{ color: req.status === 'confirmed' ? 'green' : 'red' }}>
                  {req.status}
                </span>
              </p>
              {req.donorName && (
                <p style={{color: 'black'}}><strong>Donor:</strong> {req.donorName}</p>
              )}
             {req.donorEmail && (
                <Link to={`/chat/${req.donorEmail}`}>
                  <button style={styles.chatBtn}>
                    💬 Chat with {req.donorName || req.donorEmail}
                  </button>
                </Link>
              )}
              {req.donorPhone && (
                <Link to={`tel:${req.donorPhone}`}>
                  <button style={styles.callBtn}>
                    📞 Call Donor
                  </button>
                </Link>
              )}
            </div>
          ))
        )
      )
    }
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

