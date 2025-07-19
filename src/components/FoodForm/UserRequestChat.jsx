// src/components/UserRequests.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRequests = async () => {
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');

      if (!role || !userId) return;

      try {
        setLoading(true)
        const res = await fetch(`https://foodmed-server3.onrender.com/requests?role=${role}&id=${userId}`);
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error('Failed to load requests:', error);
      }finally{
        setLoading(false)
      }
    };

    fetchRequests();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Requests</h2>
      {loading ? (
        <div className="spinner"></div>
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
      {/* {requests.length === 0 ? (
        <p>You haven’t made any requests yet.</p>
      ) : (
        requests.map((req, idx) => (
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
      )} */}
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
















// // UserRequests.jsx
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// const UserRequests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       const role = localStorage.getItem('role');
//       const userId = localStorage.getItem('userId');

//       if (!role || !userId) return;

//       try {
//         const res = await fetch(`http://localhost:3001/requests?role=${role}&id=${userId}`);
//         const data = await res.json();
//         setRequests(data);
//       } catch (error) {
//         console.error('Failed to load requests:', error);
//       }
//     };

//     fetchRequests();
//   }, []);

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>My Requests</h2>
//       {requests.length === 0 ? (
//         <p>You haven’t made any requests yet.</p>
//       ) : (
//         requests.map((req, idx) => (
//           <div key={idx} style={styles.card}>
//             <h3>{req.foodName}</h3>
//             <p><strong>Status:</strong>
//               <span style={{ color: req.status === 'confirmed' ? 'green' : 'orange' }}>
//                 {req.status}
//               </span>
//             </p>

//             {req.donorEmail && (
//               <Link to={`/chat/${recipientId}`}>

//                 <button style={styles.chatBtn}>💬 Chat with Donor</button>
//               </Link>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// const styles = {
//   card: {
//     border: '1px solid #ccc',
//     padding: '1rem',
//     marginBottom: '1rem',
//     borderRadius: '8px',
//     background: '#f9f9f9'
//   },
//   chatBtn: {
//     background: 'orange',
//     color: 'white',
//     border: 'none',
//     padding: '0.5rem 1rem',
//     borderRadius: '20px',
//     cursor: 'pointer',
//     marginTop: '0.5rem'
//   }
// };

// export default UserRequests;
