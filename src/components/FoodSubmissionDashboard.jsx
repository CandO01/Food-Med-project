import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
import notificationSound from '../assets/notification.mp3.mp3'; 

const SubmissionsDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    fetch('https://foodmed-server2.onrender.com/submissions')
      .then(res => res.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch submissions:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://foodmed-server2.onrender.com/requests')
        .then(res => res.json())
        .then(data => {
          const confirmed = data.filter(req => req.status === 'confirmed')
          if (confirmed.length > 0) {
            setNotifications(prev => {
              const newNotifs = confirmed
                .filter(c => !prev.find(p => p.id === c.id))
                .map(c => ({
                  id: c.id,
                  message: `✅ Request for ${c.foodName} has been confirmed.`,
                  type: 'confirmed'
                }))
              if (newNotifs.length > 0) {
                setHasNewNotification(true);
                return [...prev, ...newNotifs];
              }
              return prev;
            })
          }
        })
        .catch(err => console.error('📡 Error checking confirmations:', err))
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRequest = async (item) => {
    const userEmail = prompt("Enter your email:");
    const userPhone = prompt("Enter your phone number (with +234...):");

    if (!userEmail || !userPhone) {
      alert("Email and phone number are required to place a request.");
      return;
    }

    const response = await fetch('https://foodmed-server2.onrender.com/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: item.id,
        foodName: item.foodName,
        email: userEmail,
        phone: userPhone
      })
    });

    const result = await response.json();
    alert(result.message);

    if (audioRef.current) {
      audioRef.current.play();
    }

    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: `Request sent for ${item.foodName}`,
      type: 'request'
    }]);
    setHasNewNotification(true);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setHasNewNotification(false);
  };

  const filtered = submissions.filter(item =>
    item.foodName.toLowerCase().includes(search.toLowerCase())
  );

  const closeModal = () => setSelectedItem(null);

  if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>;

  return (
    <div style={styles.dashboard}>
      <audio ref={audioRef} src={notificationSound} preload="auto" />

      <div style={styles.topBar}>
        <h2 style={styles.header}>Food Submissions Dashboard</h2>
        <motion.div
          style={styles.bell}
          animate={{ rotate: hasNewNotification ? [0, -15, 15, -10, 10, 0] : 0 }}
          transition={{ duration: 0.6 }}
          onClick={toggleNotifications}
        >
          <FaBell size={24} color="orange" />
          {hasNewNotification && (
            <span
              style={{
                ...styles.dot,
                background: notifications.some(n => n.type === 'confirmed') ? 'green' : 'red'
              }}
            />
          )}
        </motion.div>
      </div>

      {showNotifications && (
        <div style={styles.notificationPanel}>
          <h4>Notifications</h4>
          <ul>
            {notifications.map((n, i) => (
              <li key={i} style={{ color: n.type === 'confirmed' ? 'green' : 'black' }}>{n.message}</li>
            ))}
          </ul>
          <button style={styles.closeBtn} onClick={toggleNotifications}>Close</button>
        </div>
      )}

      <input
        type="text"
        placeholder="Search by food name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.grid}>
        {filtered.map(item => (
          <motion.div
            key={item.id}
            style={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedItem(item)}
          >
            {item.imageUrl?.startsWith('/uploads/') && (
              <img
                src={`https://foodmed-server2.onrender.com${item.imageUrl}`}
                alt={item.foodName}
                style={styles.image}
              />
            )}
            <h3>{item.foodName}</h3>
            <p>{item.description}</p>
            <button onClick={(e) => { e.stopPropagation(); handleRequest(item); }} style={styles.requestBtn}>Request</button>
          </motion.div>
        ))}
      </div>

      {selectedItem && (
        <motion.div
          style={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div style={styles.modal} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <button style={styles.closeBtn} onClick={closeModal}>X</button>
            <h2>{selectedItem.foodName}</h2>
            <img
              src={`https://foodmed-server2.onrender.com${selectedItem.imageUrl}`}
              alt={selectedItem.foodName}
              style={styles.modalImage}
            />
            <p><strong>Description:</strong> {selectedItem.description}</p>
            <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
            <p><strong>Expiry Date:</strong> {selectedItem.expiryDate}</p>
            <p><strong>Location:</strong> {selectedItem.location}</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const styles = {
  dashboard: {
    padding: '1.2rem',
    background: '#1a1a1a',
    minHeight: '100vh',
    color: 'white',
    position: 'relative',
    marginBottom: '3.0rem',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  header: {
    textAlign: 'center',
  },
  bell: {
    position: 'relative',
    cursor: 'pointer'
  },
  dot: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'red'
  },
  notificationPanel: {
    background: '#fff',
    color: '#000',
    borderRadius: 8,
    padding: '1rem',
    maxWidth: 300,
    position: 'absolute',
    top: 70,
    right: 20,
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    zIndex: 2
  },
  search: {
    padding: '0.5rem 1rem',
    width: '100%',
    maxWidth: '400px',
    display: 'block',
    margin: '0 auto 2rem auto',
    borderRadius: '5px',
    border: '1px solid orange',
  },
  grid: {
    display: 'grid',
    gap: '0.5rem',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  card: {
    background: '#fff',
    color: '#000',
    borderRadius: '10px',
    padding: '1rem',
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  image: {
    width: '50%',
    height: 90,
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  requestBtn: {
    marginTop: '0.5rem',
    padding: '0.5rem 1.5rem',
    background: 'orange',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    color: '#000',
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
    textAlign: 'center',
  },
  modalImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    marginBottom: '1rem',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 15,
    background: 'red',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.8rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default SubmissionsDashboard;














//This is my old form post request

// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

// const SubmissionsDashboard = () => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [selectedItem, setSelectedItem] = useState(null);

//   useEffect(() => {
//     fetch('http://localhost:3000/submissions')
//       .then(res => res.json())
//       .then(data => {
//         setSubmissions(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Failed to fetch submissions:', err);
//         setLoading(false);
//       });
//   }, []);

//   const filtered = submissions.filter(item =>
//     item.foodName.toLowerCase().includes(search.toLowerCase())
//   );

//   const closeModal = () => setSelectedItem(null);

//   if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>;

//   return (
//     <div style={styles.dashboard}>
//       <h2 style={styles.header}>Food Submissions Dashboard</h2>
//       <input
//         type="text"
//         placeholder="Search by food name..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={styles.search}
//       />

//       <div style={styles.grid}>
//         {filtered.map(item => (
//           <motion.div
//             key={item.id}
//             style={styles.card}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             onClick={() => setSelectedItem(item)}
//           >
//             {item.imageUrl && (
//               <img
//                 src={`http://localhost:3000${item.imageUrl}`}
//                 alt={item.foodName}
//                 style={styles.image}
//               />
//             )}
//             <h3>{item.foodName}</h3>
//             <p>{item.description}</p>
//           </motion.div>
//         ))}
//       </div>

//       {selectedItem && (
//         <motion.div
//           style={styles.modalOverlay}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <motion.div style={styles.modal} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
//             <button style={styles.closeBtn} onClick={closeModal}>X</button>
//             <h2>{selectedItem.foodName}</h2>
//             <img
//               src={`http://localhost:3000${selectedItem.imageUrl}`}
//               alt={selectedItem.foodName}
//               style={styles.modalImage}
//             />
//             <p><strong>Description:</strong> {selectedItem.description}</p>
//             <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
//             <p><strong>Expiry Date:</strong> {selectedItem.expiryDate}</p>
//             <p><strong>Location:</strong> {selectedItem.location}</p>
//           </motion.div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   dashboard: {
//     padding: '2rem',
//     background: '#1a1a1a',
//     minHeight: '100vh',
//     color: 'white',
//   },
//   header: {
//     textAlign: 'center',
//     marginBottom: '1rem',
//   },
//   search: {
//     padding: '0.5rem 1rem',
//     width: '100%',
//     maxWidth: '400px',
//     display: 'block',
//     margin: '0 auto 2rem auto',
//     borderRadius: '5px',
//     border: '1px solid orange',
//   },
//   grid: {
//     display: 'grid',
//     gap: '1.5rem',
//     gridTemplateColumns: 'repeat(2, 1fr)',
//   },
//   card: {
//     background: '#fff',
//     color: '#000',
//     borderRadius: '10px',
//     padding: '1rem',
//     textAlign: 'center',
//     cursor: 'pointer',
//     boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//   },
//   image: {
//     width: '100%',
//     height: 150,
//     objectFit: 'cover',
//     borderRadius: '8px',
//     marginBottom: '1rem',
//   },
//   modalOverlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modal: {
//     background: '#fff',
//     padding: '2rem',
//     borderRadius: '10px',
//     color: '#000',
//     maxWidth: '500px',
//     width: '100%',
//     position: 'relative',
//     textAlign: 'center',
//   },
//   modalImage: {
//     width: '100%',
//     height: 'auto',
//     borderRadius: '10px',
//     marginBottom: '1rem',
//   },
//   closeBtn: {
//     position: 'absolute',
//     top: 10,
//     right: 15,
//     background: 'red',
//     color: 'white',
//     border: 'none',
//     padding: '0.5rem 0.8rem',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
// };

// export default SubmissionsDashboard;