import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaBell } from 'react-icons/fa';
import successIcon from '../../assets/check1.gif'
function FoodForm () {
  const [formData, setFormData] = useState({
        donorId: localStorage.getItem('donorId') || '',
        donorName: '',
        donorPhone: '',
        donorEmail: localStorage.getItem('donorEmail') || '',
        foodName: '',
        description: '',
        quantity: '',
        expiryDate: '',
        location: '',
        foodType: '',
        mode: ''
      });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [unexpiredItems, setUnexpiredItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'donorEmail') localStorage.setItem('donorEmail', value);
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleDrop = e => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setImages(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!images.length) return alert('Please upload at least one image');

    const data = new FormData();
    data.append('image', images[0]); // Using one image
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val);
    });

    try {
      setUploading(true);
      const res = await fetch('https://foodmed-server3.onrender.com/submit', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit');
      
      //show success upload
      setShowModal(true)
      setTimeout(()=>{
        setShowModal(false)
      },5000)

        if (localStorage.getItem('role') !== 'donor') {
          localStorage.setItem('role', 'donor');
          localStorage.setItem('donorId', localStorage.getItem('userEmail'));
        }
      fetchUnexpiredItems();
      setUploading(false);
    } catch (err) {
      console.error('Error submitting:', err);
      alert('Failed to submit');
    }
  };

  const fetchUnexpiredItems = async () => {
    try {
      const res = await fetch('https://foodmed-server3.onrender.com/submissions');
      const items = await res.json();
      const now = Date.now();
      const filtered = items.filter(
        item => new Date(item.expiryDate).getTime() > now && item.donorId === formData.donorId
      );
      setUnexpiredItems(filtered);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
  };

  const handleRequest = async item => {
    try {
      const response = await fetch('https://foodmed-server3.onrender.com/request', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: crypto.randomUUID(), 
                userId: localStorage.getItem('userId'),
                donorId: item.donorId,
                foodId: item.id,
                foodName: item.foodName,
                email: localStorage.getItem('userEmail'),  // if stored
                phone: localStorage.getItem('userPhone'),  // if stored
                userName: localStorage.getItem('userName'),
                status: 'pending'
              })
            });

      const result = await response.json();
      if (response.ok) {
        setNotifications(prev => [...prev, result.message || `Request for "${item.foodName}" sent`]);
      } else {
        setNotifications(prev => [...prev, `Failed to request "${item.foodName}"`]);
      }
    } catch (err) {
      console.error('Error sending request:', err);
    }
  };

  useEffect(() => {
    fetchUnexpiredItems();
  }, [formData.donorId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const userId = localStorage.getItem('userEmail') || localStorage.getItem('donorEmail');
        const role = localStorage.getItem('role');

        if (!userId || !role) return;

        const res = await fetch(`https://foodmed-server3.onrender.com/requests?role=${role}&id=${userId}`);
        const requests = await res.json();
        const accepted = requests.filter(r => r.status === 'accepted');
        setNotifications(accepted.map(r => `Your request for "${r.foodName}" was accepted`));
      } catch (e) {
        console.error('Failed to fetch requests:', e);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div
          style={styles.imageBox}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          <label htmlFor="imageUpload" style={styles.uploadLabel}>
            <FaCloudUploadAlt size={40} color="orange" />
            <p style={{ margin: '0.5rem 0 0 0' }}>Click or drag & drop image(s)</p>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={styles.hiddenInput}
            />
          </label>
          <span style={styles.note}>
            {images.length ? `${images.length} image(s) selected` : '(At least one photo required)'}
          </span>
          <div style={styles.previewContainer}>
            {previews.map((src, i) => (
              <img key={i} src={src} alt="preview" style={styles.previewImage} />
            ))}
          </div>
        </div>

        {/* Donor Fields */}
        <input
          type="text"
          name="donorName"
          placeholder="Your Full Name"
          value={formData.donorName}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="tel"
          name="donorPhone"
          placeholder="Your Phone Number"
          value={formData.donorPhone}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="donorEmail"
          placeholder="Your Email"
          value={formData.donorEmail}
          onChange={handleChange}
          style={styles.input}
          required
        />

        {/* Food Fields */}
        <input
          type="text"
          name="foodName"
          placeholder="Food Name"
          value={formData.foodName}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Confirm Location"
          value={formData.location}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <select
          name="foodType"
          value={formData.foodType}
          onChange={handleChange}
          style={{ ...styles.input, borderBottom: '2px solid orange' }}
          required
        >
          <option value="">Select Food Type</option>
          <option value="Fruits">Fruits</option>
          <option value="Proteins">Proteins</option>
          <option value="Palliatives">Palliatives</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Tubers">Tubers</option>
          <option value="Grains">Grains</option>
          <option value="Oil">Oil</option>
        </select>

        {/* Mode of the food */}
        <select
          name="mode"
          value={formData.mode}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select Mode</option>
          <option value="Free">Free Share</option>
          <option value="Barter">Barter</option>
        </select>
        {/* <button type="submit" style={styles.button}>Submit</button> */}
        <button type="submit" disabled={uploading} style={styles.button}>
          {uploading ? (
            <>
             <span className='spinner1'></span>
              Uploading...
            </>
          ): (
            'Submit'
          )}
        </button>
      </form>

      {/* Unexpired Items */}
      <div style={{ padding: '1rem' }}>
        <h3>My Unexpired Food Items</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {unexpiredItems.length === 0 && <li>No unexpired food items found.</li>}
          {unexpiredItems.map(item => (
            <li key={item.id} style={{ marginBottom: '3.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={item.imageUrl}
                alt={item.foodName}
                style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ccc' }}
              />
              <div>
                <strong>{item.foodName}</strong><br />
                <small>Expires on: {item.expiryDate}</small><br />
                <button onClick={() => handleRequest(item)} style={styles.reqBtn}>Request</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Notifications */}
      <div style={{ position: 'fixed', top: 20, right: 20 }}>
        <FaBell color="orange" size={24} />
        {notifications.length > 0 && (
          <ul style={{ background: '#fff', color: '#000', padding: '0.5rem', borderRadius: '5px', marginTop: '2.5rem' }}>
            {notifications.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        )}
      </div>
      {/* Success modal upload */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <img style={styles.imageIcon}  src={successIcon} alt="uploaded successfully animation" />
            <p style={{fontSize: 20, fontWeight: 600, color: 'black'}}>Your food is uploaded successfully.</p>
            <button onClick={() => setShowModal(false)} style={styles.modalBtn}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  form: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '400px',
    margin: '2rem auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
  },
  imageBox: {
    border: '2px dashed orange',
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '1rem',
    textAlign: 'center',
    cursor: 'pointer',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  hiddenInput: { display: 'none' },
  note: {
    display: 'block',
    color: '#999',
    fontSize: '0.85rem',
    marginTop: '0.5rem',
  },
  previewContainer: {
    marginTop: '1rem',
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  previewImage: {
    width: 60,
    height: 60,
    objectFit: 'cover',
    borderRadius: 8,
    border: '1px solid #ccc',
  },
  input: {
    padding: '0.6rem',
    margin: '1rem 0',
    border: 'none',
    borderBottom: '2px solid orange',
    outline: 'none',
    fontSize: '1rem',
  },
  button: {
    background: 'orange',
    color: '#fff',
    padding: '0.8rem',
    border: 'none',
    borderRadius: '20px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  reqBtn: {
    marginTop: '0.4rem',
    background: 'orange',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
   modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '300px',
    width: '90%',
  },
  modalBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1.2rem',
    background: 'orange',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  imageIcon:{
    width: '180px',

  }
};

export default FoodForm;

