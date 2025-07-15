import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
import { FaRegUser } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { MdOutlineTimer } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { LocationContext } from '../../LocationContext/LocationContext';
import notificationSound from '../../assets/notification.mp3.mp3'
import loadingImg from '../../assets/loading3.gif';
import firstFood from '../../assets/food1.jpg';
import secondFood from '../../assets/food2.jpeg';
import thirdFood from '../../assets/food3.jpeg';
import fourthFood from '../../assets/food4.jpeg';
import fifthFood from '../../assets/food5.jpeg';
import sixthFood from '../../assets/food6.jpeg';
import fruits from '../../assets/fruit.png';
import vegetables from '../../assets/vegetables.png';
import palliative from '../../assets/palliative.png';
import protein from '../../assets/protein.png';
import beverages from '../../assets/beverages.png';
import grains from '../../assets/grains.png';
import RequestModal from '../RequestModal';

//this is to handle the time the food item is posted 
 function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // in seconds

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  if (diff < 172800) return 'Yesterday';
  return `${Math.floor(diff / 86400)} day(s) ago`;
 }


const SubmissionsDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);      // for Food Details Modal
  const [requestItem, setRequestItem] = useState(null);        // for Request Modal
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const audioRef = useRef(null);

  const name = localStorage.getItem('userName') || 'Guest'
  const { state, country } = React.useContext(LocationContext)

  const carouselSlides = [
    { image: firstFood },
    { image: secondFood },
    { image: thirdFood },
    { image: fourthFood },
    { image: fifthFood },
    { image: sixthFood },
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

   const categories = [
    { name: 'Fruits', image: fruits },
    { name: 'Proteins', image: protein },
    { name: 'Palliatives', image: palliative },
    { name: 'Vegetables', image: vegetables },
    { name: 'Beverages', image: beverages },
    { name: 'Grains', image: grains },
  ];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % carouselSlides.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? carouselSlides.length - 1 : prev - 1
    );

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  setLoading(true);
  const query = selectedCategory ? `?type=${selectedCategory}` : '';
  fetch(`https://foodmed-server3.onrender.com/submissions${query}`)
    .then((res) => res.json())
    .then((data) => {
      setSubmissions(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Failed to fetch submissions:', err);
      setLoading(false);
    });
}, [selectedCategory]);


  useEffect(() => {
  const interval = setInterval(() => {
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userEmail') || localStorage.getItem('donorEmail');
    
    if (!role || !userId) return;
            fetch(`https://foodmed-server3.onrender.com/requests?role=${role}&id=${userId}`)
              .then((res) => res.json())
              .then((data) => {
                if (!Array.isArray(data)) {
                  console.error('Invalid response format:', data);
                  return;
                }

                const confirmed = data.filter((req) => req.status === 'confirmed');
                if (confirmed.length > 0) {
                  setNotifications((prev) => {
                    const newNotifs = confirmed
                      .filter((c) => !prev.find((p) => p.id === c.id))
                      .map((c) => ({
                        id: c.id,
                        message: `✅ Request for ${c.foodName} has been confirmed.`,
                        type: 'confirmed',
                      }));
                    if (newNotifs.length > 0) {
                        // 🔊 Play notification sound
                        if (audioRef.current) {
                          audioRef.current.play().catch((err) =>
                            console.warn('Audio play failed:', err)
                          );
                        }
                      setHasNewNotification(true);
                    if (confirmed.length > 0) {
                      setNotifications((prev) => {
                        const newNotifs = confirmed
                          .filter((c) => !prev.find((p) => p.id === c.id))
                          .map((c) => ({
                            id: c.id,
                            message: `✅ Request for ${c.foodName} has been confirmed.`,
                            type: 'confirmed',
                          }));

                        if (newNotifs.length > 0) {
                          setHasNewNotification(true);
                          return [...prev, ...newNotifs].slice(-10); // ✅ Limit to last 10
                        }

                        return prev;
                      });
                    }


                    }
                    return prev;
                  });
                }
              })
              .catch((err) =>
                console.error('📡 Error checking confirmations:', err)
              );
          }, 10000);

          return () => clearInterval(interval);
        }, []);

    
  const modalRequest = <RequestModal
                        item={requestItem}
                        isOpen={!!requestItem}
                        onClose={() => setRequestItem(null)}
                        onSubmit={async (item) => {
                        const userId = localStorage.getItem('userId') || localStorage.getItem('donorId');
                        const userEmail = localStorage.getItem('userEmail') ||  localStorage.getItem('donorEmail')
                         const userPhone = localStorage.getItem('userPhone');
                         const userName = localStorage.getItem('userName');

                        if (!item.donorEmail || !item.donorId || !item.donorName) {
                            alert("This food item is missing some donor information. Please select a newer one.");
                            return;
                          }

                        if (!userId || !userEmail || !userPhone || !item) {
                          alert('Missing user info or phone number');
                          return;
                        }

                        const res = await fetch('https://foodmed-server3.onrender.com/request', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                    itemId: item.id,
                                    foodName: item.foodName,
                                    donorId: item.donorId,
                                    donorEmail: item.donorEmail,
                                    donorName: item.donorName,
                                    userId,
                                    userName,
                                    email: userEmail,
                                    phone: userPhone,
                                    status: 'pending'
                                  })
                            });


                        const result = await res.json();
                        if (res.ok) {
                          setNotifications((prev) => [...prev, { id: crypto.randomUUID(), message: `🟠 Request sent for ${item.foodName}`, type: 'sent' }].slice(-10));
                          if (audioRef.current) audioRef.current.play().catch(console.warn);
                          setHasNewNotification(true);
                          alert(result.message);
                          setSelectedItem(null);
                        } else {
                          alert('Request failed.');
                        }
                      }}
                    />

  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setHasNewNotification(false);
  };

  const filtered = submissions.filter((item) => {
    const matchesSearch = item.foodName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.foodType?.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    return matchesSearch && matchesCategory;
  });

  const closeModal = () => setSelectedItem(null);

  const themeStyles = {
    background: darkMode ? 'black' : 'white',
    color: darkMode ? 'white' : 'black',
  };

  const renderImage = (url) => {
    return url?.startsWith('http')
      ? url
      : `https://foodmed-server3.onrender.com${url}`;
  };

  if (loading)
    return (
      <img
        src={loadingImg}
        alt="Loading..."
        style={{
          width: '100px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    );

  return (
    <div style={{ ...styles.dashboard, ...themeStyles }}>
      <audio ref={audioRef} src={notificationSound} preload="auto" />
      <button onClick={() => setDarkMode(!darkMode)} style={styles.modeBtn}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <motion.div
        style={styles.bellTopRight}
        animate={{
          rotate: hasNewNotification ? [0, -15, 15, -10, 10, 0] : 0,
        }}
        transition={{ duration: 0.6 }}
        onClick={toggleNotifications}
      >
        <FaBell size={24} color="orange" />
        {hasNewNotification && (
          <span
            style={{
              ...styles.dot,
              background: notifications.some((n) => n.type === 'confirmed')
                ? 'green'
                : 'red',
            }}
          />
        )}
      </motion.div>

        {/* User name and location */}
      <div style={styles.greetings}>
        <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
          <p>Hi {name}</p>
          <MdOutlineWavingHand style={styles.greetingIcons} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginRight: -25}}>
        <MdLocationPin style={styles.greetingIcons}/>
        {state}, {country}
        </div>
      </div>
      <div style={styles.carouselWrapper}>
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={styles.carouselSlide}
        >
          <img
            src={carouselSlides[currentImageIndex].image}
            alt="Food Slide"
            style={styles.carouselImage}
          />
          <div style={styles.carouselOverlay}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                window.scrollTo({ top: 400, behavior: 'smooth' })
              }
              style={styles.exploreBtn}
            >
              Explore Now
            </motion.button>
          </div>
        </motion.div>

        <button onClick={prevImage} style={{ ...styles.arrow, left: 10 }}>
          <MdKeyboardArrowLeft size={30} />
        </button>
        <button onClick={nextImage} style={{ ...styles.arrow, right: 10 }}>
          <MdKeyboardArrowRight size={30} />
        </button>

        <div style={styles.dotsWrapper}>
          {carouselSlides.map((_, index) => (
            <div
              key={index}
              style={{
                ...styles.dotIndicator,
                backgroundColor:
                  index === currentImageIndex ? 'white' : 'gray',
              }}
            />
          ))}
        </div>
      </div>

      {showNotifications && (
        <div style={styles.notificationPanel}>
          <h4>Notifications</h4>
          <ul>
            {notifications.map((n, i) => (
              <li
                key={i}
                style={{ color: n.type === 'confirmed' ? 'green' : 'black' }}
              >
                {n.message}
              </li>
            ))}
          </ul>
          <button style={styles.closeBtn} onClick={toggleNotifications}>
            Close
          </button>
        </div>
      )}
      {/* new features filter by food items button */}
      <div style={{ padding: '1rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Categories</h2>
          <button
              onClick={() => setSelectedCategory('')}
              style={{
                padding: '0.5rem 1rem',
                background: selectedCategory === '' ? 'orange' : '#eee',
                color: selectedCategory === '' ? 'white' : '#000',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer'
              }}
        >
          See All
        </button>
        </div>

        <div
          style={{
            overflowX: 'auto',
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '0.5rem',
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)
              }
              style={{
                minWidth: '140px',
                padding: '0.5rem',
                borderRadius: '100%',
                cursor: 'pointer',
                background: selectedCategory === cat.name ? 'orange' : '#eee',
                color: selectedCategory === cat.name ? 'white' : '#000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '100%',
                  marginBottom: '0.3rem'
                }}
              />
              <span
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: selectedCategory === cat.name ? 'white' : '#000',
                }}
              >
                {cat.name}
              </span>
            </div>
          ))}
        </div>

      <input
        type="text"
        placeholder="Search by food name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.grid}>
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            style={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={renderImage(item.imageUrl)}
              alt={item.foodName}
              style={styles.image}
            />
            <div style={{display: 'flex', flexDirection: 'column', flexBasis: '70%'}}>
             <small 
              style={{
                backgroundColor: 'white',
                color: item.mode?.toLowerCase()=== 'barter' ? 'orange' : 'green' ,
                width: '40px',
                padding: '2px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              {item.mode?.toLowerCase() === 'barter' ? 'Barter' : 'Share'}
            </small>

              <h3 style={{margin: 0}}>{item.foodName}</h3>
              <p style={styles.description}>{item.description}</p>
              <div>
                <small><FaRegUser /> {item.donorName} </small>
                <small><MdLocationPin /> {item.location} </small>
                <small><MdOutlineTimer /> Posted on: {timeAgo(item.createdAt)} </small>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRequestItem(item); // open the Request Modal
                }}
                style={styles.requestBtn}
              >
                {item.mode?.toLowerCase() === 'barter' ? 'Trade Now' : 'Request Now'}
              </button>

            </div>
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
          <motion.div
            style={styles.modal}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <button style={styles.closeBtn} onClick={closeModal}>
              X
            </button>
            <h2>{selectedItem.foodName}</h2>
            <img
              src={renderImage(selectedItem.imageUrl)}
              alt={selectedItem.foodName}
              style={styles.modalImage}
            />
            <p>
              <strong>Description:</strong> {selectedItem.description}
            </p>
            <p>
              <strong>Quantity:</strong> {selectedItem.quantity}
            </p>
            <p>
              <strong>Expiry Date:</strong> {selectedItem.expiryDate}
            </p>
            <p>
              <strong>Location:</strong> {selectedItem.location}
            </p>
            <p>
              <strong>Mode:</strong> {selectedItem.mode}
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>

     {/* Request Modal */}
      { modalRequest }
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
    width: '100vw',
    maxWidth: '100%',
    marginBottom: '3.2rem',
  },
  modeBtn: {
    position: 'fixed',
    top: 10,
    left: 10,
    zIndex: 1000,
    padding: '0.5rem 1rem',
    background: 'orange',
    border: 'none',
    borderRadius: '5px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  bellTopRight: {
    position: 'sticky',
    top: 10,
    right: 20,
    float: 'right',
    cursor: 'pointer',
    zIndex: 1000,
    background: '#1a1a1a',
    padding: '0.3rem',
    borderRadius: '50%',
  },
  dot: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'red',
  },
  greetings: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '30px',
    // position: 'fixed',
    // top: '0'
  },
  greetingIcons: {
    color: 'orange', 
    fontSize: '20px', 
    fontWeight: 800
  },
  carouselWrapper: {
    position: 'relative',
    width: '100%',
    height: '220px',
    overflow: 'hidden',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    padding: '0.6rem',
  },
  carouselSlide: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 15,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.7rem',
    textAlign: 'center',
  },
  exploreBtn: {
    backgroundColor: 'orange',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1.2rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.7)',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    padding: '5px',
    zIndex: 1,
  },
  dotsWrapper: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: 'orange',
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
    zIndex: 2,
  },
  search: {
    padding: '0.5rem 1rem',
    width: '100%',
    maxWidth: '400px',
    display: 'block',
    margin: '0 auto 2rem auto',
    borderRadius: '50px',
    border: '1px solid orange',
  },
grid: {
  display: 'grid',
  gap: '0.5rem',
  gridTemplateColumns: 'repeat(1, 1fr)',
  width: '100%',
  // padding: '0.5rem',
  boxSizing: 'border-box',
},
card: {
  background: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: '#000',
  borderRadius: '10px',
  padding: '1.2rem 1rem',
  border: '2px solid orange',
  cursor: 'pointer',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  // minHeight: '250px', 
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box'
},
  image: {
    width: '200px',
    flexBasis: '30%',
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
  description: {
  whiteSpace: 'normal',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block',
  width: '100%',
  maxWidth: '100%',
  height: '1.2em',
  lineHeight: '1.2em',
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
    width: '70%',
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






// import React, { useEffect, useState, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { FaBell } from 'react-icons/fa';
// import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
// import notificationSound from '../assets/notification.mp3.mp3';
// import loadingImg from '../assets/loading3.gif';
// import firstFood from '../assets/food1.jpg';
// import secondFood from '../assets/food2.jpeg';
// import thirdFood from '../assets/food3.jpeg';
// import fourthFood from '../assets/food4.jpeg';
// import fifthFood from '../assets/food5.jpeg';
// import sixthFood from '../assets/food6.jpeg';

// const SubmissionsDashboard = () => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [hasNewNotification, setHasNewNotification] = useState(false);
//   const [darkMode, setDarkMode] = useState(true);
//   const audioRef = useRef(null);

//   const carouselSlides = [
//     { 
//       image: firstFood 
//     },
//     { 
//       image: secondFood 
//     },
//     { 
//       image: thirdFood
//     },
//         { 
//       image: fourthFood 
//     },
//     { 
//       image: fifthFood 
//     },
//     { 
//       image: sixthFood 
//     },
//   ];
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % carouselSlides.length);
//   const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));

//   useEffect(() => {
//     const interval = setInterval(nextImage, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     setLoading(true);
//     fetch('https://foodmed-server2.onrender.com/submissions')
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

//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetch('https://foodmed-server2.onrender.com/requests')
//         .then(res => res.json())
//         .then(data => {
//           const confirmed = data.filter(req => req.status === 'confirmed');
//           if (confirmed.length > 0) {
//             setNotifications(prev => {
//               const newNotifs = confirmed
//                 .filter(c => !prev.find(p => p.id === c.id))
//                 .map(c => ({
//                   id: c.id,
//                   message: `✅ Request for ${c.foodName} has been confirmed.`,
//                   type: 'confirmed'
//                 }));
//               if (newNotifs.length > 0) {
//                 setHasNewNotification(true);
//                 return [...prev, ...newNotifs];
//               }
//               return prev;
//             });
//           }
//         })
//         .catch(err => console.error('📡 Error checking confirmations:', err));
//     }, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleRequest = async (item) => {
//     const userEmail = prompt("Enter your email:");
//     const userPhone = prompt("Enter your phone number (with +234...):");
//     if (!userEmail || !userPhone) {
//       alert("Email and phone number are required to place a request.");
//       return;
//     }
//     const response = await fetch('https://foodmed-server2.onrender.com/request', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         itemId: item.id,
//         foodName: item.foodName,
//         email: userEmail,
//         phone: userPhone
//       })
//     });
//     const result = await response.json();
//     alert(result.message);
//     if (audioRef.current) audioRef.current.play();
//     setNotifications(prev => [...prev, {
//       id: Date.now(),
//       message: `Request sent for ${item.foodName}`,
//       type: 'request'
//     }]);
//     setHasNewNotification(true);
//   };

//   const toggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//     setHasNewNotification(false);
//   };

//   const filtered = submissions.filter(item =>
//     item.foodName.toLowerCase().includes(search.toLowerCase())
//   );

//   const closeModal = () => setSelectedItem(null);

//     const themeStyles = {
//     background: darkMode ? '#1a1a1a' : '#f4f4f4',
//     color: darkMode ? 'white' : 'black',
//   };

//   if (loading) return (
//     <img 
//       src={loadingImg} 
//       alt="Loading..." 
//       style={{
//         width: '100px',
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)'
//       }}
//     />
//   );

//   return (
//     <div style={{ ...styles.dashboard, ...themeStyles }}>
//       <audio ref={audioRef} src={notificationSound} preload="auto" />
//       <button onClick={() => setDarkMode(!darkMode)} style={styles.modeBtn}>
//         {darkMode ? 'Light Mode' : 'Dark Mode'}
//       </button>

//       {/* 🔔 Sticky Notification Bell */}
//       <motion.div
//         style={styles.bellTopRight}
//         animate={{ rotate: hasNewNotification ? [0, -15, 15, -10, 10, 0] : 0 }}
//         transition={{ duration: 0.6 }}
//         onClick={toggleNotifications}
//       >
//         <FaBell size={24} color="orange" />
//         {hasNewNotification && (
//           <span
//             style={{
//               ...styles.dot,
//               background: notifications.some(n => n.type === 'confirmed') ? 'green' : 'red'
//             }}
//           />
//         )}
//       </motion.div>

//       {/* 🖼️ Carousel */}
//       <div style={styles.carouselWrapper}>
//         <motion.div
//           key={currentImageIndex}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 1 }}
//           style={styles.carouselSlide}
//         >
//           <img
//             src={carouselSlides[currentImageIndex].image}
//             alt="Food Slide"
//             style={styles.carouselImage}
//           />
//           <div style={styles.carouselOverlay}>
//             <motion.div
//               key={carouselSlides[currentImageIndex].text}
//               initial={{ opacity: 0, scale: 0.8, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
//               style={styles.carouselText}
//             >
//               {carouselSlides[currentImageIndex].text}
//             </motion.div>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
//               style={styles.exploreBtn}
//             >
//               Explore Now
//             </motion.button>
//           </div>
//         </motion.div>

//         <button onClick={prevImage} style={{ ...styles.arrow, left: 10 }}>
//           <MdKeyboardArrowLeft size={30} />
//         </button>
//         <button onClick={nextImage} style={{ ...styles.arrow, right: 10 }}>
//           <MdKeyboardArrowRight size={30} />
//         </button>

//         <div style={styles.dotsWrapper}>
//           {carouselSlides.map((_, index) => (
//             <div
//               key={index}
//               style={{
//                 ...styles.dotIndicator,
//                 backgroundColor: index === currentImageIndex ? 'white' : 'gray',
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* 🔔 Notification Panel */}
//       {showNotifications && (
//         <div style={styles.notificationPanel}>
//           <h4>Notifications</h4>
//           <ul>
//             {notifications.map((n, i) => (
//               <li key={i} style={{ color: n.type === 'confirmed' ? 'green' : 'black' }}>{n.message}</li>
//             ))}
//           </ul>
//           <button style={styles.closeBtn} onClick={toggleNotifications}>Close</button>
//         </div>
//       )}

//       {/* 🔍 Search */}
//       <input
//         type="text"
//         placeholder="Search by food name..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={styles.search}
//       />

//       {/* 📦 Grid */}
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
//             {item.imageUrl?.startsWith('/uploads/') && (
//               console.log(item.imageUrl),

//               <img
//                 src={
//                   item.imageUrl?.startsWith('/uploads/')
//                     ? `https://foodmed-server2.onrender.com${item.imageUrl}`
//                     : item.imageUrl
//                 }
//                 alt={item.foodName}
//                 style={styles.image}
//               />
//             )}
//             <h3>{item.foodName}</h3>
//             <p>{item.description}</p>
//             <button onClick={(e) => { e.stopPropagation(); handleRequest(item); }} style={styles.requestBtn}>Request</button>
//           </motion.div>
//         ))}
//       </div>

//       {/* 🔍 Modal */}
//       {selectedItem && (
//         <motion.div style={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//           <motion.div style={styles.modal} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
//             <button style={styles.closeBtn} onClick={closeModal}>X</button>
//             <h2>{selectedItem.foodName}</h2>
//             <img
//               src={`https://foodmed-server2.onrender.com${selectedItem.imageUrl}`}
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
//     padding: '1.2rem',
//     background: '#1a1a1a',
//     minHeight: '100vh',
//     color: 'white',
//     position: 'relative',
//     width: '100vw',
//     maxWidth: '100%',
//      marginBottom: '3.2rem',
//   },
//     modeBtn: {
//     position: 'fixed',
//     top: 10,
//     left: 10,
//     zIndex: 1000,
//     padding: '0.5rem 1rem',
//     background: 'orange',
//     border: 'none',
//     borderRadius: '5px',
//     fontSize: '0.9rem',
//     cursor: 'pointer',
//   },
//   bellTopRight: {
//     position: 'sticky',
//     top: 10,
//     right: 20,
//     float: 'right',
//     cursor: 'pointer',
//     zIndex: 1000,
//     background: '#1a1a1a',
//     padding: '0.3rem',
//     borderRadius: '50%',
//   },
//   dot: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     width: 10,
//     height: 10,
//     borderRadius: '50%',
//     background: 'red',
//   },
//   carouselWrapper: {
//     position: 'relative',
//     width: '100%',
//     height: '220px',
//     overflow: 'hidden',
//     borderRadius: '12px',
//     marginBottom: '1.5rem',
//     // backgroundColor: '#198754',
//     padding: '0.6rem',
//   },
//   carouselSlide: {
//     width: '100%',
//     height: '100%',
//     position: 'relative',
//   },
//   carouselImage: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover',
//     borderRadius: '10px',
//   },
//   carouselOverlay: {
//     position: 'absolute',
//     bottom: 15,
//     left: '50%',
//     transform: 'translateX(-50%)',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     gap: '0.7rem',
//     textAlign: 'center',
//   },
//   // carouselText: {
//   //   color: 'white',
//   //   backgroundColor: 'rgba(0,0,0,0.6)',
//   //   padding: '0.4rem 1rem',
//   //   borderRadius: '6px',
//   //   fontSize: '1rem',
//   //   fontWeight: 'bold',
//   //   maxWidth: '90%',
//   // },
//   exploreBtn: {
//     backgroundColor: 'orange',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     padding: '0.5rem 1.2rem',
//     fontSize: '0.9rem',
//     cursor: 'pointer',
//     transition: 'background-color 0.3s ease',
//   },
//   arrow: {
//     position: 'absolute',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     background: 'rgba(255,255,255,0.7)',
//     border: 'none',
//     borderRadius: '50%',
//     cursor: 'pointer',
//     padding: '5px',
//     zIndex: 1,
//   },
//   dotsWrapper: {
//     position: 'absolute',
//     bottom: 8,
//     width: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     gap: '6px',
//   },
//   dotIndicator: {
//     width: 10,
//     height: 10,
//     borderRadius: '50%',
//     backgroundColor: 'orange',
//   },
//   notificationPanel: {
//     background: '#fff',
//     color: '#000',
//     borderRadius: 8,
//     padding: '1rem',
//     maxWidth: 300,
//     position: 'absolute',
//     top: 70,
//     right: 20,
//     boxShadow: '0 0 10px rgba(0,0,0,0.2)',
//     zIndex: 2,
//   },
//   search: {
//     padding: '0.5rem 1rem',
//     width: '100%',
//     maxWidth: '400px',
//     display: 'block',
//     margin: '0 auto 2rem auto',
//     borderRadius: '50px',
//     border: '1px solid orange',
//   },
//   grid: {
//     display: 'grid',
//     gap: '0.5rem',
//     gridTemplateColumns: 'repeat(2, 1fr)',
//     width: '100%',
//   },
//   card: {
//     background: '#fff',
//     color: '#000',
//     borderRadius: '10px',
//     padding: '1rem',
//     textAlign: 'center',
//     cursor: 'pointer',
//     boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//     width: '100%',
//   },
//   image: {
//     width: '50%',
//     height: 90,
//     objectFit: 'cover',
//     borderRadius: '8px',
//     marginBottom: '1rem',
//   },
//   requestBtn: {
//     marginTop: '0.5rem',
//     padding: '0.5rem 1.5rem',
//     background: 'orange',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
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
