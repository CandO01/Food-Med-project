
import React, { useEffect, useState, useRef } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from './DonorConfirmationModal';
import { io } from 'socket.io-client';
import { FaComments } from 'react-icons/fa';
import { AuthContext } from '../../AuthenticationContext/Authcontext'
import { useLocation } from 'react-router-dom';

const socket = io('https://foodmed-server3.onrender.com');

const DonorProfile = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [messagePreview, setMessagePreview] = useState({});
  const [loading, setLoading] = useState(false)
  const location = useLocation();

  const { user } = React.useContext(AuthContext)

  const navigate = useNavigate();
  const audioRef = useRef(null);

const fetchData = async () => {
  const donorId = localStorage.getItem('donorId') || localStorage.getItem('userId');
  const donorEmail = localStorage.getItem('donorEmail') || localStorage.getItem('userEmail');

  //   console.log("📦 donorId:", donorId);
  // console.log("📧 donorEmail:", donorEmail);

  if (!donorEmail || !donorId) {
    console.warn("🚫 donorEmail or donorId not found in localStorage");
    return;
  }

  try {
    setLoading(true);
    const foodRes = await fetch(`https://foodmed-server3.onrender.com/submissions?email=${donorEmail}`);
    const allFood = await foodRes.json();

    // console.log('🍤 uploaded foods', allFood);

    const reqRes = await fetch(`https://foodmed-server3.onrender.com/requests?id=${donorId}&type=donor`);

    const allRequests = await reqRes.json();
    // console.log('✔ All requests', allRequests);

    const itemsWithRequests = allFood.map(item => {
      const itemRequests = allRequests.filter(req => req.itemId === item.id);
      return { ...item, requests: itemRequests };
    });
    // console.log('🔍 Incoming requests:', itemsWithRequests);
    setFoodItems(itemsWithRequests);
  } catch (err) {
    console.error('Error loading data:', err);
  }finally {
      setLoading(false); 
    }
};

useEffect(()=>{
  socket.on('requestUpdated', () => {
    console.log('📢 requestUpdated received');
    fetchData()
  });
    return () => {
        socket.off('requestUpdated');
      socket.off('newMessage');
    };
    // return () => socket.disconnect();
}, [])

  useEffect(() => {
    fetchData()
    socket.on('newMessage', ({ sender, message }) => {
      setUnreadMessages(prev => ({ ...prev, [sender]: (prev[sender] || 0) + 1 }));
      setMessagePreview(prev => ({ ...prev, [sender]: message }));
      if (audioRef.current) audioRef.current.play().catch(() => {});
    });

 
  }, [location]);


  const updateHistory = (id, foodName, status) => {
    const existing = JSON.parse(localStorage.getItem('requestHistory')) || [];
    const updated = [...existing, { id, foodName, status, timestamp: new Date().toISOString() }];
    localStorage.setItem('requestHistory', JSON.stringify(updated));
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

      setModalMessage(result.message);
      setShowFeedbackModal(true);
      updateHistory(selectedRequest.id, selectedRequest.foodName, 'confirmed');
      setTimeout(() => setShowFeedbackModal(false), 3000);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to confirm request:', err);
    }
  };

  const initiateReject = (reqId) => {
    setPendingRejectId(reqId);
    setShowRejectConfirm(true);
  };

  const confirmReject = async () => {
    try {
      const res = await fetch(`https://foodmed-server3.onrender.com/request/delete/${pendingRejectId}`, {
        method: 'DELETE'
      });
      const result = await res.json();

      setModalMessage(result.message);
      setShowFeedbackModal(true);
      updateHistory(pendingRejectId, 'unknown', 'rejected');
      setTimeout(() => setShowFeedbackModal(false), 3000);
      setShowRejectConfirm(false);
      setPendingRejectId(null);
      fetchData();
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  const handleChatClick = (email) => {
    setUnreadMessages(prev => ({ ...prev, [email]: 0 }));
    setMessagePreview(prev => ({ ...prev, [email]: '' }));
    navigate(`/chat/${email}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      <Link to='/food-form' style={styles.backLink}><IoArrowBack style={{color: '#4CAF50'}} /> Back</Link>
      <h2>{localStorage.getItem("userName")}'s Donor Profile</h2>
      {loading ? (
        <div className="spinner"></div> //the css is in the universal file /App.css 
      ) : foodItems.length === 0 ? (
        <p>No food items uploaded yet.</p> // 🚫 no items
      ) : (
     foodItems.map((item, index) => (
      <div key={index} style={styles.card}>
        <h3 style={{color: 'black'}}>{item.foodName}</h3>
        <p style={{color: 'black'}}><strong>Quantity:</strong> {item.quantity}</p>
        <p style={{color: 'black'}}><strong>Mode:</strong> {item.mode}</p>
        <p style={{color: 'black'}}><strong>Expiry:</strong> {item.expiryDate}</p>

      <h4>User Requests:</h4>
      {item.requests.length === 0 ? (
              <p style={{ color: 'white' }}>No requests.</p>
            ) : (
              item.requests.map((req, idx) => (
                <div key={idx} style={styles.requestItem}>
                  <p style={{color: 'black'}}><strong>User:</strong> {req.userName || req.userEmail}</p>
                  <p style={{color: 'black'}}><strong>Email:</strong> {req.userEmail}</p>
                  <p style={{color: 'black'}}>
                    <strong>Status:</strong>{' '}
                    <span style={{ color: req.status === 'confirmed' ? 'green' : 'red' }}>
                      {req.status}
                    </span>
                  </p>

                  {req.status !== 'confirmed' && (
                    <div style={styles.buttonGroup}>
                      <button onClick={() => handleConfirmClick(req)} style={styles.confirmBtn}>✅ Confirm</button>
                      <button onClick={() => initiateReject(req.id)} style={styles.rejectBtn}>❌ Reject</button>
                    </div>
                  )}

                  <button onClick={() => handleChatClick(req.userEmail)} style={styles.chatBtn} title="Chat with user">
                    <FaComments />
                    {unreadMessages[req.userEmail] > 0 && (
                      <span style={styles.unreadDot}>
                        <span style={styles.pulse}></span>
                        {unreadMessages[req.userEmail]}
                      </span>
                    )}
                  </button>

                  {messagePreview[req.userEmail] && (
                    <p style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: '#555' }}>
                      <em>"{messagePreview[req.userEmail]}"</em>
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        ))
      )}


      {showModal && (
        <ConfirmModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmRequest}
        />
      )}

      {showFeedbackModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}><p>{modalMessage}</p></div>
        </div>
      )}

      {showRejectConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p style={{color: 'black'}}>Are you sure you want to reject this request?</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={confirmReject} style={styles.confirmBtn}>Yes</button>
              <button onClick={() => setShowRejectConfirm(false)} style={styles.rejectBtn}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  backLink: { display: 'inline-flex', gap: '0.5rem', color: '#4CAF50', marginBottom: '1rem', textDecoration: 'none' },
  card: { background: '#fff', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  requestItem: { padding: '0.8rem', border: '1px solid #ccc', borderRadius: '8px', marginTop: '1rem' },
  buttonGroup: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  confirmBtn: { background: 'green', color: '#fff', padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', cursor: 'pointer' },
  rejectBtn: { background: 'red', color: '#fff', padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', cursor: 'pointer' },
  chatBtn: { background: '#4CAF50', color: '#fff', padding: '0.5rem', border: 'none', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', position: 'relative' },
  unreadDot: { position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', fontSize: '0.65rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1.2s infinite' },
  pulse: { position: 'absolute', top: '-6px', right: '-6px', width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255, 0, 0, 0.6)', animation: 'pulseAnim 1.2s infinite', zIndex: -1 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  modalContent: { background: '#fff', padding: '1.5rem', borderRadius: '10px', textAlign: 'center', minWidth: '300px', fontSize: '1rem' },
};

export default DonorProfile;

