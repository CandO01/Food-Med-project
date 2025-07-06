import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const DonorRequestsDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);
  const donorEmail = localStorage.getItem('donorEmail');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://foodmed-server2.onrender.com/submissions');
        const allItems = await res.json();

        const donorItems = allItems.filter(item => item.donorEmail === donorEmail);

        const reqRes = await fetch('https://foodmed-server2.onrender.com/requests');
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

    fetchData();
  }, [donorEmail]);

  const confirmRequest = async (reqId) => {
    const date = prompt('Enter delivery date (e.g. 2025-07-08)');
    const time = prompt('Enter delivery time (e.g. 12:00 PM)');
    const location = prompt('Enter pickup location');

    if (!date || !time || !location) {
      alert('All fields are required to confirm.');
      return;
    }

    try {
      const res = await fetch(`https://foodmed-server2.onrender.com/request/update/${reqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, location })
      });

      const result = await res.json();
      alert(result.message);
      window.location.reload();
    } catch (err) {
      console.error('Failed to confirm request:', err);
    }
  };

  const rejectRequest = async (reqId) => {
    if (!window.confirm('Are you sure you want to reject/delete this request?')) return;

    try {
      const res = await fetch(`https://foodmed-server2.onrender.com/request/delete/${reqId}`, {
        method: 'DELETE'
      });

      const result = await res.json();
      alert(result.message);
      window.location.reload();
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Link to='/food-form' style={styles.backLink}><IoArrowBack /> Back to Food Form</Link>
      <h2 style={styles.heading}>Requests for Your Donations</h2>

      {foodItems.length === 0 ? (
        <p>You have not received any food requests yet.</p>
      ) : (
        foodItems.map((item, index) => (
          <div key={index} style={styles.card}>
            <h3>{item.foodName}</h3>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Expiry Date:</strong> {item.expiryDate}</p>

            <h4 style={{ marginTop: '1rem' }}>User Requests:</h4>
            {item.requests.length === 0 ? (
              <p style={{ color: 'gray' }}>No requests yet.</p>
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
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    textDecoration: 'none',
    color: 'orange',
    fontWeight: 'bold'
  },
  heading: {
    color: 'orange',
    marginBottom: '1rem'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '1.5rem',
    background: '#fff',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  requestItem: {
    background: '#f9f9f9',
    padding: '0.8rem',
    borderRadius: '5px',
    marginBottom: '0.8rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  confirmBtn: {
    background: 'green',
    color: 'white',
    border: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  rejectBtn: {
    background: 'red',
    color: 'white',
    border: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default DonorRequestsDashboard;

















// import React, { useEffect, useState } from 'react';
// import { IoArrowBack } from "react-icons/io5";
// import { Link } from 'react-router-dom';

// const DonorRequestsDashboard = () => {
//   const [foodItems, setFoodItems] = useState([]);
//   const donorEmail = localStorage.getItem('donorEmail');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch('https://foodmed-server2.onrender.com/submissions');
//         const allItems = await res.json();

//         // Only donor's items
//         const donorItems = allItems.filter(item => item.donorEmail === donorEmail);

//         // Fetch all requests
//         const reqRes = await fetch('https://foodmed-server2.onrender.com/requests');
//         const allRequests = await reqRes.json();

//         // Attach requests to donor items
//         const itemsWithRequests = donorItems.map(item => {
//           const requestsForItem = allRequests.filter(r => r.foodName === item.foodName);
//           return { ...item, requests: requestsForItem };
//         });

//         setFoodItems(itemsWithRequests);
//       } catch (err) {
//         console.error('Failed to load data:', err);
//       }
//     };

//     fetchData();
//   }, [donorEmail]);

//   return (
//     <div style={{ padding: '2rem' }}>
//       <Link style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', textDecoration: 'none', color: 'orange' }} to='/food-form'><IoArrowBack /> Back to Food Form</Link>
//       <h2 style={{ color: 'orange', marginBottom: '1rem' }}>Requests for Your Donations</h2>
//       {foodItems.length === 0 ? (
//         <p>You have not received any food requests from users for your submitted food items yet.</p>
//       ) : (
//         foodItems.map((item, index) => (
//           <div key={index} style={styles.card}>
//             <h3>{item.foodName}</h3>
//             <p><strong>Quantity:</strong> {item.quantity}</p>
//             <p><strong>Expiry Date:</strong> {item.expiryDate}</p>

//             <h4 style={{ marginTop: '1rem' }}>User Requests:</h4>
//             {item.requests.length === 0 ? (
//               <p style={{ color: 'gray' }}>No requests yet.</p>
//             ) : (
//               <ul style={styles.list}>
//                 {item.requests.map((req, idx) => (
//                   <li key={idx} style={styles.requestItem}>
//                     <strong>User Email:</strong> {req.userEmail} <br />
//                     <strong>Status:</strong> {req.status}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// const styles = {
//   card: {
//     border: '1px solid #ddd',
//     borderRadius: '10px',
//     padding: '1rem',
//     marginBottom: '1.5rem',
//     background: '#fff',
//     boxShadow: '0 0 8px rgba(0,0,0,0.1)',
//   },
//   list: {
//     listStyle: 'none',
//     paddingLeft: 0,
//   },
//   requestItem: {
//     background: '#f9f9f9',
//     padding: '0.5rem',
//     borderRadius: '5px',
//     marginBottom: '0.5rem',
//   },
// };

// export default DonorRequestsDashboard;
