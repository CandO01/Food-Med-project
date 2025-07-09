import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function FoodForm () {
  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    quantity: '',
    expiryDate: '',
    location: '',
    foodType: '', 
    donorEmail: localStorage.getItem('donorEmail') || '',
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [unexpiredItems, setUnexpiredItems] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value 
    });

    if (name === 'donorEmail') {
      localStorage.setItem('donorEmail', value);
    }
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
    images.forEach(img => data.append('image', img));
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));

    try {
      const res = await fetch('https://foodmed-server2.onrender.com/submit', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      alert(result.message || 'Submitted!');
      fetchUnexpiredItems();
      const donorEmail = localStorage.getItem("donorEmail");
      data.append('donorEmail', donorEmail);
    } catch (err) {
      console.error('Error submitting:', err);
      alert('Failed to submit');
    }
  };

  const fetchUnexpiredItems = async () => {
    try {
      const res = await fetch('https://foodmed-server2.onrender.com/submissions');
      const items = await res.json();
      const now = Date.now();
      const filtered = items.filter(
        item => new Date(item.expiryDate).getTime() > now && item.donorEmail === formData.donorEmail
      );
      setUnexpiredItems(filtered);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
  };

  const handleRequest = async (item) => {
    try {
      const response = await fetch('https://foodmed-server2.onrender.com/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          foodName: item.foodName,
          status: 'pending'
        })
      });
      const result = await response.json();
      if (response.ok) {
        setNotifications(prev => [...prev, result.message || `Request for "${item.foodName}" sent`]);
      } else {
        console.error('Server Error:', result.error || result);
        setNotifications(prev => [...prev, `Failed to request "${item.foodName}"`]);
      }
    } catch (err) {
      console.error('Error sending request:', err);
    }
  };

  useEffect(() => {
    fetchUnexpiredItems();
  }, [formData.donorEmail]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('https://foodmed-server2.onrender.com/requests');
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
          onDragOver={(e) => e.preventDefault()}
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

        <input
          type="email"
          name="donorEmail"
          placeholder="Your Email"
          value={formData.donorEmail}
          onChange={handleChange}
          style={styles.input}
          required
        />
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
        <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}> 
          <input 
            type="date" 
            name="expiryDate" 
            value={formData.expiryDate} 
            onChange={handleChange} 
            style={styles.input} 
            required 
          />
          <p style={{marginTop:'-10px', fontSize: '0.8rem', color: '#999'}}>Expiry Date</p>
        </div>
        <input 
          type="text" 
          name="location" 
          placeholder="Confirm Location" 
          value={formData.location} 
          onChange={handleChange} 
          style={styles.input} 
          required 
        />

        {/* ✅ New Food Type Dropdown */}
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
          <option value="Beverages">Beverages</option>
          <option value="Grains">Grains</option>
        </select>

        <button type="submit" style={styles.button}>Submit</button>
      </form>

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

      <div style={{ position: 'fixed', top: 20, right: 20 }}>
        <FaBell color="orange" size={24} />
        {notifications.length > 0 && (
          <ul style={{ background: '#fff', color: '#000', padding: '0.5rem', borderRadius: '5px', marginTop: '2.5rem', marginBottom: '1rem' }}>
            {notifications.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        )}
      </div>
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
  hiddenInput: { 
    display: 'none' 
  },
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
    margin: '1.2rem 0', 
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
};

export default FoodForm;










//SECOND FORM 
// import React, { useState } from 'react';
// import { FaCloudUploadAlt } from 'react-icons/fa';

// const FoodForm = () => {
//   const [formData, setFormData] = useState({
//     foodName: '',
//     description: '',
//     quantity: '',
//     expiryDate: '',
//     location: '',
//   });
//   const [images, setImages] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [unexpiredItems, setUnexpiredItems] = useState([]);

//   const handleChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = e => {
//     const files = Array.from(e.target.files);
//     setImages(files);
//     setPreviews(files.map(file => URL.createObjectURL(file)));
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const files = Array.from(e.dataTransfer.files);
//     setImages(files);
//     setPreviews(files.map(file => URL.createObjectURL(file)));
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!images.length) return alert('Please upload at least one image');

//     const data = new FormData();
//     images.forEach(img => data.append('image', img));

//     Object.entries(formData).forEach(([key, val]) => data.append(key, val));

//     try {
//       const res = await fetch('http://localhost:3000/submit', {
//         method: 'POST',
//         body: data,
//       });
//       const result = await res.json();
//       alert(result.message || 'Submitted!');
//       fetchUnexpiredItems();
//     } catch (err) {
//       console.error('Error submitting:', err);
//       alert('Failed to submit');
//     }
//   };

//   const fetchUnexpiredItems = async () => {
//     try {
//       const res = await fetch('http://localhost:3000/submissions');
//       const items = await res.json();
//       const now = Date.now();
//       const filtered = items.filter(item => new Date(item.expiryDate).getTime() > now);
//       setUnexpiredItems(filtered);
//     } catch (err) {
//       console.error('Failed to fetch items:', err);
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <div
//           style={styles.imageBox}
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={handleDrop}
//         >
//           <label htmlFor="imageUpload" style={styles.uploadLabel}>
//             <FaCloudUploadAlt size={40} color="orange" />
//             <p style={{ margin: '0.5rem 0 0 0' }}>Click or drag & drop image(s)</p>
//             <input
//               type="file"
//               id="imageUpload"
//               accept="image/*"
//               multiple
//               onChange={handleImageChange}
//               style={styles.hiddenInput}
//             />
//           </label>
//           <span style={styles.note}>
//             {images.length ? `${images.length} image(s) selected` : '(At least one photo required)'}
//           </span>
//           <div style={styles.previewContainer}>
//             {previews.map((src, i) => (
//               <img key={i} src={src} alt="preview" style={styles.previewImage} />
//             ))}
//           </div>
//         </div>

//         <input
//           type="text"
//           name="foodName"
//           placeholder="Food Name"
//           value={formData.foodName}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <input
//           type="text"
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <input
//           type="text"
//           name="quantity"
//           placeholder="Quantity"
//           value={formData.quantity}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <input
//           type="date"
//           name="expiryDate"
//           value={formData.expiryDate}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <input
//           type="text"
//           name="location"
//           placeholder="Confirm Location"
//           value={formData.location}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />

//         <button type="submit" style={styles.button}>Submit</button>
//       </form>

//       {/* Unexpired items list */}
//       <div style={{ padding: '1rem' }}>
//         <h3>Unexpired Food Items</h3>
//         <ul>
//           {unexpiredItems.map(item => (
//             <li key={item.id}>{item.foodName} (Expires on: {item.expiryDate})</li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// const styles = {
//   form: {
//     background: '#fff',
//     padding: '1.5rem',
//     borderRadius: '10px',
//     width: '90%',
//     maxWidth: '400px',
//     margin: '2rem auto',
//     display: 'flex',
//     flexDirection: 'column',
//     boxShadow: '0 0 10px rgba(0,0,0,0.2)',
//   },
//   imageBox: {
//     border: '2px dashed orange',
//     borderRadius: '10px',
//     padding: '1rem',
//     marginBottom: '1rem',
//     textAlign: 'center',
//     cursor: 'pointer',
//   },
//   uploadLabel: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     cursor: 'pointer',
//   },
//   hiddenInput: {
//     display: 'none',
//   },
//   note: {
//     display: 'block',
//     color: '#999',
//     fontSize: '0.85rem',
//     marginTop: '0.5rem',
//   },
//   previewContainer: {
//     marginTop: '1rem',
//     display: 'flex',
//     gap: '0.5rem',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   previewImage: {
//     width: 60,
//     height: 60,
//     objectFit: 'cover',
//     borderRadius: 8,
//     border: '1px solid #ccc',
//   },
//   input: {
//     padding: '0.6rem',
//     margin: '1.2rem 0',
//     border: 'none',
//     borderBottom: '2px solid orange',
//     outline: 'none',
//     fontSize: '1rem',
//   },
//   button: {
//     background: 'orange',
//     color: '#fff',
//     padding: '0.8rem',
//     border: 'none',
//     borderRadius: '20px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     marginTop: '1rem',
//   },
// };

// export default FoodForm;


// import React, { useState } from 'react';
// import { FaCloudUploadAlt } from 'react-icons/fa'; // you need to install react-icons

// const FoodForm = () => {
//   const [formData, setFormData] = useState({
//     foodName: '',
//     description: '',
//     quantity: '',
//     expiryDate: '',
//     location: '',
//   });
//   const [image, setImage] = useState(null);


//   function handleChange(e){
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value,
//     }));
//   }


//   function handleImageChange(e) {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//     } else {
//       setImage(null);
//     }
//   }

// async function handleSubmit(e) {
//     e.preventDefault();
//     const data = new FormData();

//     if (!image) return alert('Please add an image');

//     data.append('image', image);
//     data.append('foodName', formData.foodName);
//     data.append('description', formData.description);
//     data.append('quantity', formData.quantity);
//     data.append('expiryDate', formData.expiryDate);
//     data.append('location', formData.location);

//     try {
//       const res = await fetch('http://localhost:3000/submit', {
//         method: 'POST',
//         body: data,
//       });
//       const result = await res.json();
//       alert(result.message || 'Submitted!');
//     } catch (err) {
//       console.error('Error submitting:', err);
//       alert('Failed to submit');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={styles.form}>
//       <div style={styles.imageBox}>
//         <label htmlFor="imageUpload" style={styles.uploadLabel}>
//           <FaCloudUploadAlt size={40} color="orange" />
//           <p style={{ margin: '0.5rem 0 0 0' }}>Click to upload image</p>
//           <input
//             type="file"
//             id="imageUpload"
//             accept="image/*"
//             onChange={handleImageChange}
//             style={styles.hiddenInput}
//             required
//           />
//         </label>
//         <span style={styles.note}>
//           {image ? `Selected: ${image.name}` : '(At least one photo required)'}
//         </span>
//       </div>

//       <input
//         type="text"
//         name="foodName"
//         placeholder="Food Name"
//         value={formData.foodName}
//         onChange={handleChange}
//         style={styles.input}
//         required
//       />
//       <input
//         type="text"
//         name="description"
//         placeholder="Description"
//         value={formData.description}
//         onChange={handleChange}
//         style={styles.input}
//         required
//       />
//       <input
//         type="text"
//         name="quantity"
//         placeholder="Quantity"
//         value={formData.quantity}
//         onChange={handleChange}
//         style={styles.input}
//         required
//       />
//       <input
//         type="date"
//         name="expiryDate"
//         placeholder="Expiry Date"
//         value={formData.expiryDate}
//         onChange={handleChange}
//         style={styles.input}
//         required
//       />
//       <input
//         type="text"
//         name="location"
//         placeholder="Confirm Location"
//         value={formData.location}
//         onChange={handleChange}
//         style={styles.input}
//         required
//       />

//       <button type="submit" style={styles.button}>Submit</button>
//     </form>
//   );
// };

// const styles = {
//   form: {
//     background: '#fff',
//     padding: '1.5rem',
//     borderRadius: '10px',
//     width: '90%',
//     maxWidth: '400px',
//     margin: '2rem auto',
//     display: 'flex',
//     flexDirection: 'column',
//     boxShadow: '0 0 10px rgba(0,0,0,0.2)',
//   },
//   imageBox: {
//     border: '2px dashed orange',
//     borderRadius: '10px',
//     padding: '1rem',
//     marginBottom: '1rem',
//     textAlign: 'center',
//     cursor: 'pointer',
//   },
//   uploadLabel: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     cursor: 'pointer',
//   },
//   hiddenInput: {
//     display: 'none',
//   },
//   note: {
//     display: 'block',
//     color: '#999',
//     fontSize: '0.85rem',
//     marginTop: '0.5rem',
//   },
//   input: {
//     padding: '0.6rem',
//     margin: '1.2rem 0',
//     border: 'none',
//     borderBottom: '2px solid orange',
//     outline: 'none',
//     fontSize: '1rem',
//   },
//   button: {
//     background: 'orange',
//     color: '#fff',
//     padding: '0.8rem',
//     border: 'none',
//     borderRadius: '20px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     marginTop: '1rem',
//   },
// };

// export default FoodForm;





//SECOND FORM 
// import React, { useState } from 'react';
// import { FaCloudUploadAlt } from 'react-icons/fa';

// const FoodForm = () => {
//   const [formData, setFormData] = useState({
//     foodName: '',
//     description: '',
//     quantity: '',
//     expiryDate: '',
//     location: '',
//   });
//   const [images, setImages] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [unexpiredItems, setUnexpiredItems] = useState([]);

//   const handleChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = e => {
//     const files = Array.from(e.target.files);
//     setImages(files);
//     setPreviews(files.map(file => URL.createObjectURL(file)));
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const files = Array.from(e.dataTransfer.files);
//     setImages(files);
//     setPreviews(files.map(file => URL.createObjectURL(file)));
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!images.length) return alert('Please upload at least one image');

//     const data = new FormData();
//     images.forEach(img => data.append('image', img));

//     Object.entries(formData).forEach(([key, val]) => data.append(key, val));

//     try {
//       const res = await fetch('http://localhost:3000/submit', {
//         method: 'POST',
//         body: data,
//       });
//       const result = await res.json();
//       alert(result.message || 'Submitted!');
//       fetchUnexpiredItems();
//     } catch (err) {
//       console.error('Error submitting:', err);
//       alert('Failed to submit');
//     }
//   };

//   const fetchUnexpiredItems = async () => {
//     try {
//       const res = await fetch('http://localhost:3000/submissions');
//       const items = await res.json();
//       const now = Date.now();
//       const filtered = items.filter(item => new Date(item.expiryDate).getTime() > now);
//       setUnexpiredItems(filtered);
//     } catch (err) {
//       console.error('Failed to fetch items:', err);
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <div
//           style={styles.imageBox}
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={handleDrop}
//         >
//           <label htmlFor="imageUpload" style={styles.uploadLabel}>
//             <FaCloudUploadAlt size={40} color="orange" />
//             <p style={{ margin: '0.5rem 0 0 0' }}>Click or drag & drop image(s)</p>
//             <input
//               type="file"
//               id="imageUpload"
//               accept="image/*"
//               multiple
//               onChange={handleImageChange}
//               style={styles.hiddenInput}
//             />
//           </label>
//           <span style={styles.note}>
//             {images.length ? `${images.length} image(s) selected` : '(At least one photo required)'}
//           </span>
//           <div style={styles.previewContainer}>
//             {previews.map((src, i) => (
//               <img key={i} src={src} alt="preview" style={styles.previewImage} />
//             ))}
//           </div>
//         </div>

//         <input
//           type="text"
//           name="foodName"
//           placeholder="Food Name"
//           value={formData.foodName}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <input
//           type="text"
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <input
//           type="text"
//           name="quantity"
//           placeholder="Quantity"
//           value={formData.quantity}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <input
//           type="date"
//           name="expiryDate"
//           value={formData.expiryDate}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <input
//           type="text"
//           name="location"
//           placeholder="Confirm Location"
//           value={formData.location}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />

//         <button type="submit" style={styles.button}>Submit</button>
//       </form>

//       {/* Unexpired items list */}
//       <div style={{ padding: '1rem' }}>
//         <h3>Unexpired Food Items</h3>
//         <ul>
//           {unexpiredItems.map(item => (
//             <li key={item.id}>{item.foodName} (Expires on: {item.expiryDate})</li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// const styles = {
//   form: {
//     background: '#fff',
//     padding: '1.5rem',
//     borderRadius: '10px',
//     width: '90%',
//     maxWidth: '400px',
//     margin: '2rem auto',
//     display: 'flex',
//     flexDirection: 'column',
//     boxShadow: '0 0 10px rgba(0,0,0,0.2)',
//   },
//   imageBox: {
//     border: '2px dashed orange',
//     borderRadius: '10px',
//     padding: '1rem',
//     marginBottom: '1rem',
//     textAlign: 'center',
//     cursor: 'pointer',
//   },
//   uploadLabel: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     cursor: 'pointer',
//   },
//   hiddenInput: {
//     display: 'none',
//   },
//   note: {
//     display: 'block',
//     color: '#999',
//     fontSize: '0.85rem',
//     marginTop: '0.5rem',
//   },
//   previewContainer: {
//     marginTop: '1rem',
//     display: 'flex',
//     gap: '0.5rem',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   previewImage: {
//     width: 60,
//     height: 60,
//     objectFit: 'cover',
//     borderRadius: 8,
//     border: '1px solid #ccc',
//   },
//   input: {
//     padding: '0.6rem',
//     margin: '1.2rem 0',
//     border: 'none',
//     borderBottom: '2px solid orange',
//     outline: 'none',
//     fontSize: '1rem',
//   },
//   button: {
//     background: 'orange',
//     color: '#fff',
//     padding: '0.8rem',
//     border: 'none',
//     borderRadius: '20px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     marginTop: '1rem',
//   },
// };

// export default FoodForm;


// import React, { useState } from 'react';
// import { FaCloudUploadAlt } from 'react-icons/fa'; // you need to install react-icons

// const FoodForm = () => {
//   const [formData, setFormData] = useState({
//     foodName: '',
//     description: '',
//     quantity: '',
//     expiryDate: '',
//     location: '',
//   });
//   const [image, setImage] = useState(null);


//   function handleChange(e){
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value,
//     }));
//   }


//   function handleImageChange(e) {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//     } else {
//       setImage(null);
//     }
//   }

// async function handleSubmit(e) {
//     e.preventDefault();
//     const data = new FormData();

//     if (!image) return alert('Please add an image');

//     data.append('image', image);
//     data.append('foodName', formData.foodName);
//     data.append('description', formData.description);
//     data.append('quantity', formData.quantity);
//     data.append('expiryDate', formData.expiryDate);
//     data.append('location', formData.location);

//     try {
//       const res = await fetch('http://localhost:3000/submit', {
//         method: 'POST',
//         body: data,
//       });
//       const result = await res.json();
//       alert(result.message || 'Submitted!');
//     } catch (err) {
//       console.error('Error submitting:', err);
//       alert('Failed to submit');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={styles.form}>
//       <div style={styles.imageBox}>
//         <label htmlFor="imageUpload" style={styles.uploadLabel}>
//           <FaCloudUploadAlt size={40} color="orange" />
//           <p style={{ margin: '0.5rem 0 0 0' }}>Click to upload image</p>
//           <input
//             type="file"
//             id="imageUpload"
//             accept="image/*"
//             onChange={handleImageChange}
//             style={styles.hiddenInput}
//             required
//           />
//         </label>
//         <span style={styles.note}>
//           {image ? `Selected: ${image.name}` : '(At least one photo required)'}
//         </span>
//       </div>

//       <input
//         type="text"
//         name="foodName"
//         placeholder="Food Name"
//         value={formData.foodName}
//         onChange={handleChange}
//         style={styles.input}
//         required
//       />
//       <input
//         type="text"
//         name="description"
//         placeholder="Description"
//         value={formData.description}
//         onChange={handleChange}
//         style={styles.input}
//         required
//       />
//       <input
//         type="text"
//         name="quantity"
//         placeholder="Quantity"
//         value={formData.quantity}
//         onChange={handleChange}
//         style={styles.input}
//         required
//       />
//       <input
//         type="date"
//         name="expiryDate"
//         placeholder="Expiry Date"
//         value={formData.expiryDate}
//         onChange={handleChange}
//         style={styles.input}
//         required
//       />
//       <input
//         type="text"
//         name="location"
//         placeholder="Confirm Location"
//         value={formData.location}
//         onChange={handleChange}
//         style={styles.input}
//         required
//       />

//       <button type="submit" style={styles.button}>Submit</button>
//     </form>
//   );
// };

// const styles = {
//   form: {
//     background: '#fff',
//     padding: '1.5rem',
//     borderRadius: '10px',
//     width: '90%',
//     maxWidth: '400px',
//     margin: '2rem auto',
//     display: 'flex',
//     flexDirection: 'column',
//     boxShadow: '0 0 10px rgba(0,0,0,0.2)',
//   },
//   imageBox: {
//     border: '2px dashed orange',
//     borderRadius: '10px',
//     padding: '1rem',
//     marginBottom: '1rem',
//     textAlign: 'center',
//     cursor: 'pointer',
//   },
//   uploadLabel: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     cursor: 'pointer',
//   },
//   hiddenInput: {
//     display: 'none',
//   },
//   note: {
//     display: 'block',
//     color: '#999',
//     fontSize: '0.85rem',
//     marginTop: '0.5rem',
//   },
//   input: {
//     padding: '0.6rem',
//     margin: '1.2rem 0',
//     border: 'none',
//     borderBottom: '2px solid orange',
//     outline: 'none',
//     fontSize: '1rem',
//   },
//   button: {
//     background: 'orange',
//     color: '#fff',
//     padding: '0.8rem',
//     border: 'none',
//     borderRadius: '20px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     marginTop: '1rem',
//   },
// };

// export default FoodForm;