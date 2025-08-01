import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthenticationContext/Authcontext';
import successIcon from '../assets/check1.gif'

const ProfileSetup = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!user || !user.email) {
    return <p>Error: User not logged in. Please log in first.</p>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('file', profileImage);
    formData.append('upload_preset', 'foodmed_unsigned');

    const res = await fetch('https://api.cloudinary.com/v1_1/dr50qpngx/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = '';
    if (profileImage) {
      imageUrl = await handleImageUpload();
    }

    const updatedProfile = {
      email: user.email,
      bio,
      location,
      profileImage: imageUrl,
    };

    await fetch('https://foodmed-firstserver-backup.onrender.com/profile-setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfile),
    });

    setUploading(false);
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate('/welcome');
    }, 3000);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Set Up Your Profile</h2>
        <input
          type="text"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={styles.input}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.fileInput}
        />
        <button type="submit" disabled={uploading} style={styles.button}>
          {uploading ? (
            <>
             <span className='spinner1'></span>
              Uploading...
            </>
          ): (
            'Save profile'
          )}
        </button>
      </form>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
          <img style={styles.imageIcon}  src={successIcon} alt="uploaded successfully animation" />
            <h3>Profile updated successfully!</h3>
            <p>Redirecting you to the welcome page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f4f6f9',
  },
  form: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  heading: {
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  fileInput: {
    fontSize: '1rem',
  },
  button: {
    padding: '0.9rem',
    background: 'orange',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
    imageIcon:{
    width: '180px',

  }
};

export default ProfileSetup;
