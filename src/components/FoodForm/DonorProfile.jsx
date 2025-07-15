import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import ConfirmModal from './DonorConfirmationModal';

const DonorProfile = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const donorId = localStorage.getItem('donorId');
  const donorEmail = localStorage.getItem('donorEmail');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch food submissions
      const foodRes = await fetch(`https://foodmed-server3.onrender.com/submissions?email=${donorEmail}`);
      const allFood = await foodRes.json();

      // Fetch requests
      const reqRes = await fetch(`https://foodmed-server3.onrender.com/requests?role=donor&id=${donorEmail}`);
      const allRequests = await reqRes.json();

      // Match requests to food items
      const itemsWithRequests = allFood.map(item => {
        const itemRequests = allRequests.filter(req => req.itemId === item.id);
        return { ...item, requests: itemRequests };
      });

      setFoodItems(itemsWithRequests);
      setRequests(allRequests);
    } catch (err) {
      console.error('❌ Failed to load data:', err);
    }
  };

  const handleConfirmClick = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const confirmRequest = async ({ date, time, location }) => {
    try {
      const res = await fetch(`https://foodmed-server3.onrender.com/request/update/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed', date, time, location })
      });
      const result = await res.json();
      alert(result.message);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to confirm request:', err);
    }
  };

  const rejectRequest = async (reqId) => {
    if (!window.confirm('Are you sure you want to reject this request?')) return;
    try {
      const res = await fetch(`https://foodmed-server3.onrender.com/request/delete/${reqId}`, {
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
      <Link to='/food-form' style={styles.backLink}><IoArrowBack /> Back</Link>
      <h2>🍽️ Donor Profile</h2>

      {foodItems.length === 0 ? (
        <p>No food items uploaded yet.</p>
      ) : (
        foodItems.map((item, index) => (
          <div key={index} style={styles.card}>
            <h3>{item.foodName}</h3>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Mode:</strong> {item.mode}</p>
            <p><strong>Expiry:</strong> {item.expiryDate}</p>

            <h4>User Requests:</h4>
            {item.requests.length === 0 ? (
              <p style={{ color: 'gray' }}>No requests.</p>
            ) : (
              item.requests.map((req, idx) => (
                <div key={idx} style={styles.requestItem}>
                  <p><strong>User:</strong> {req.userName || req.userEmail}</p>
                  <p><strong>Email:</strong> {req.userEmail}</p>
                  <p><strong>Phone:</strong> {req.userPhone || 'N/A'}</p>
                  <p><strong>Status:</strong> <span style={{ color: req.status === 'confirmed' ? 'green' : 'orange' }}>{req.status}</span></p>

                  {req.status !== 'confirmed' && (
                    <div style={styles.buttonGroup}>
                      <button onClick={() => handleConfirmClick(req)} style={styles.confirmBtn}>✅ Confirm</button>
                      <button onClick={() => rejectRequest(req.id)} style={styles.rejectBtn}>❌ Reject</button>
                    </div>
                  )}

                  <Link to={`/chat/${req.userEmail}`}>
                    <button style={styles.chatBtn}>💬 Chat</button>
                  </Link>
                </div>
              ))
            )}
          </div>
        ))
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmRequest}
        foodName={selectedRequest?.foodName}
      />
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
    borderRadius: '5px',
    border: 'none'
  },
  rejectBtn: {
    backgroundColor: 'red',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '5px',
    border: 'none'
  },
  chatBtn: {
    marginTop: '0.5rem',
    padding: '0.4rem 0.8rem',
    background: 'orange',
    color: 'white',
    borderRadius: '5px',
    border: 'none'
  }
};

export default DonorProfile;





// import React, { useEffect, useState } from 'react';
// import { IoArrowBack } from 'react-icons/io5';
// import { Link, useNavigate } from 'react-router-dom';
// import ConfirmModal from './DonorConfirmationModal';

// const DonorProfile = () => {
//   const [foodItems, setFoodItems] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const donorId = localStorage.getItem('donorId');
//    const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const role = localStorage.getItem('role');
//       const id = localStorage.getItem('userId') || localStorage.getItem('donorId');
//       const res = await fetch(`http://localhost:3005/requests?role=${role}&id=${id}`);
//       const allRequests = await res.json();

//       console.log('🧾 Raw fetch result:', allRequests); // ✅ Log inside useEffect

//       if (!Array.isArray(allRequests)) {
//         console.error('❌ Expected an array but got:', allRequests);
//         return;
//       }

//       const myRequests = allRequests.filter(req => req.donorEmail === id);
//       setRequests(myRequests);
//     } catch (err) {
//       console.error('❌ Failed to load data:', err);
//     }
//   };

//   const handleConfirmClick = (req) => {
//     setSelectedRequest(req);
//     setShowModal(true);
//   };

//   const confirmRequest = async ({ date, time, location }) => {
//     try {
//       const res = await fetch(`http://localhost:3005/request/update/${selectedRequest.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'confirmed', date, time, location })
//       });
//       const result = await res.json();
//       alert(result.message);
//       setShowModal(false);
//       fetchData();
//     } catch (err) {
//       console.error('Failed to confirm request:', err);
//     }
//   };

//   const rejectRequest = async (reqId) => {
//     if (!window.confirm('Are you sure you want to reject this request?')) return;
//     try {
//       const res = await fetch(`http://localhost:3005/request/delete/${reqId}`, {
//         method: 'DELETE'
//       });
//       const result = await res.json();
//       alert(result.message);
//       fetchData();
//     } catch (err) {
//       console.error('Failed to reject request:', err);
//     }
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <Link to='/food-form' style={styles.backLink}><IoArrowBack /> Back</Link>
//       <h2>Donor Profile</h2>

//       {foodItems.length === 0 ? (
//         <p>No food requests yet.</p>
//       ) : (
//         foodItems.map((item, index) => (
//           <div key={index} style={styles.card}>
//             <h3>{item.foodName}</h3>
//             <p><strong>Quantity:</strong> {item.quantity}</p>
//             <p><strong>Mode:</strong> {item.mode}</p>
//             <p><strong>Expiry:</strong> {item.expiryDate}</p>

//             <h4>User Requests:</h4>
//             {item.requests.length === 0 ? (
//               <p style={{ color: 'gray' }}>No requests.</p>
//             ) : (
//               item.requests.map((req, idx) => (
//                 <div key={idx} style={styles.requestItem}>
//                   <p><strong>Email:</strong> {req.userEmail}</p>
//                   <p><strong>Status:</strong>
//                     <span style={{ color: req.status === 'confirmed' ? 'green' : 'orange' }}>
//                       {req.status}
//                     </span>
//                   </p>

//                   {req.status !== 'confirmed' && (
//                     <div style={styles.buttonGroup}>
//                       <button onClick={() => handleConfirmClick(req)} style={styles.confirmBtn}>✅ Confirm</button>
//                       <button onClick={() => rejectRequest(req.id)} style={styles.rejectBtn}>❌ Reject</button>
//                     </div>
//                   )}

//                   <Link to={`/chat/${req.userEmail}`}>
//                     <button style={styles.chatBtn}>💬 Chat</button>
//                   </Link>
//                 </div>
//               ))
//             )}
//           </div>
//         ))
//       )}

//       {/* Modal for confirming delivery */}
//       <ConfirmModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         onConfirm={confirmRequest}
//         foodName={selectedRequest?.foodName}
//       />
//     </div>
//   );
// };

// const styles = {
//   backLink: {
//     textDecoration: 'none',
//     color: 'orange',
//     marginBottom: '1rem',
//     display: 'inline-block'
//   },
//   card: {
//     border: '1px solid #ccc',
//     padding: '1rem',
//     borderRadius: '8px',
//     marginBottom: '1.5rem',
//     background: '#f9f9f9'
//   },
//   requestItem: {
//     marginTop: '1rem',
//     padding: '0.8rem',
//     backgroundColor: '#fff',
//     borderRadius: '5px',
//     border: '1px solid #ddd'
//   },
//   buttonGroup: {
//     display: 'flex',
//     gap: '1rem',
//     marginTop: '0.5rem'
//   },
//   confirmBtn: {
//     backgroundColor: 'green',
//     color: 'white',
//     padding: '0.4rem 0.8rem',
//     borderRadius: '5px',
//     border: 'none'
//   },
//   rejectBtn: {
//     backgroundColor: 'red',
//     color: 'white',
//     padding: '0.4rem 0.8rem',
//     borderRadius: '5px',
//     border: 'none'
//   },
//   chatBtn: {
//     marginTop: '0.5rem',
//     padding: '0.4rem 0.8rem',
//     background: 'orange',
//     color: 'white',
//     borderRadius: '5px',
//     border: 'none'
//   }
// };

// export default DonorProfile;

























// // DonorProfile.jsx
// import React, { useEffect, useState } from 'react';
// import { IoArrowBack } from 'react-icons/io5';
// import { Link } from 'react-router-dom';

// const DonorProfile = () => {
//   const [foodItems, setFoodItems] = useState([]);
//   const donorId = localStorage.getItem('donorId');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await fetch('http://localhost:3001/submissions');
//       const allItems = await res.json();
//       const donorItems = allItems.filter(item => item.donorEmail === donorId);

//       const reqRes = await fetch(`http://localhost:3001/requests?role=donor&id=${donorId}`);
//       const allRequests = await reqRes.json();

//       const itemsWithRequests = donorItems.map(item => {
//         const requestsForItem = allRequests.filter(r => r.foodName === item.foodName);
//         return { ...item, requests: requestsForItem };
//       });

//       setFoodItems(itemsWithRequests);
//     } catch (err) {
//       console.error('Failed to load data:', err);
//     }
//   };

//   const confirmRequest = async (reqId) => {
//     const date = prompt('Enter delivery date');
//     const time = prompt('Enter delivery time');
//     const location = prompt('Enter pickup location');

//     if (!date || !time || !location) {
//       alert('All fields are required');
//       return;
//     }

//     try {
//       const res = await fetch(`http://localhost:3001/request/update/${reqId}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'confirmed', date, time, location })
//       });
//       const result = await res.json();
//       alert(result.message);
//       fetchData();
//     } catch (err) {
//       console.error('Failed to confirm request:', err);
//     }
//   };

//   const rejectRequest = async (reqId) => {
//     if (!window.confirm('Are you sure you want to reject this request?')) return;
//     try {
//       const res = await fetch(`http://localhost:3001/request/delete/${reqId}`, {
//         method: 'DELETE'
//       });
//       const result = await res.json();
//       alert(result.message);
//       fetchData();
//     } catch (err) {
//       console.error('Failed to reject request:', err);
//     }
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <Link to='/food-form' style={styles.backLink}><IoArrowBack /> Back</Link>
//       <h2>Donor Profile</h2>

//       {foodItems.length === 0 ? (
//         <p>No food requests yet.</p>
//       ) : (
//         foodItems.map((item, index) => (
//           <div key={index} style={styles.card}>
//             <h3>{item.foodName}</h3>
//             <p><strong>Quantity:</strong> {item.quantity}</p>
//             <p><strong>Mode:</strong> {item.mode}</p>
//             <p><strong>Expiry:</strong> {item.expiryDate}</p>

//             <h4>User Requests:</h4>
//             {item.requests.length === 0 ? (
//               <p style={{ color: 'gray' }}>No requests.</p>
//             ) : (
//               item.requests.map((req, idx) => (
//                 <div key={idx} style={styles.requestItem}>
//                   <p><strong>Email:</strong> {req.userEmail}</p>
//                   <p><strong>Status:</strong>
//                     <span style={{ color: req.status === 'confirmed' ? 'green' : 'orange' }}>
//                       {req.status}
//                     </span>
//                   </p>
//                   {req.status !== 'confirmed' && (
//                     <div style={styles.buttonGroup}>
//                       <button onClick={() => confirmRequest(req.id)} style={styles.confirmBtn}>✅ Confirm</button>
//                       <button onClick={() => rejectRequest(req.id)} style={styles.rejectBtn}>❌ Reject</button>
//                     </div>
//                   )}
//                   <Link to={`/chat/${req.userEmail}`}>
//                     <button style={styles.chatBtn}>💬 Chat</button>
//                   </Link>
//                 </div>
//               ))
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// const styles = {
//   backLink: {
//     textDecoration: 'none',
//     color: 'orange',
//     marginBottom: '1rem',
//     display: 'inline-block'
//   },
//   card: {
//     border: '1px solid #ccc',
//     padding: '1rem',
//     borderRadius: '8px',
//     marginBottom: '1.5rem',
//     background: '#f9f9f9'
//   },
//   requestItem: {
//     marginTop: '1rem',
//     padding: '0.8rem',
//     backgroundColor: '#fff',
//     borderRadius: '5px',
//     border: '1px solid #ddd'
//   },
//   buttonGroup: {
//     display: 'flex',
//     gap: '1rem',
//     marginTop: '0.5rem'
//   },
//   confirmBtn: {
//     backgroundColor: 'green',
//     color: 'white',
//     padding: '0.4rem 0.8rem',
//     borderRadius: '5px',
//     border: 'none'
//   },
//   rejectBtn: {
//     backgroundColor: 'red',
//     color: 'white',
//     padding: '0.4rem 0.8rem',
//     borderRadius: '5px',
//     border: 'none'
//   },
//   chatBtn: {
//     marginTop: '0.5rem',
//     padding: '0.4rem 0.8rem',
//     background: 'orange',
//     color: 'white',
//     borderRadius: '5px',
//     border: 'none'
//   }
// };

// export default DonorProfile;










































