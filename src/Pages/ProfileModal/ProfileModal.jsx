import { color } from 'framer-motion';
import React from 'react';

const ProfileModal = ({ isOpen, onClose, profileData }) => {

  if (!isOpen || !profileData) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>X</button>
        <h2>{profileData.name || 'No Name'}</h2>
        {profileData.profileImage && (
          <img
            src={profileData.profileImage}
            alt="Profile"
            style={styles.image}
          />
        )}
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Phone:</strong> {profileData.phone || 'Not provided'}</p>
        <p><strong>Location:</strong> {profileData.location || 'Not provided'}</p>
        {/* <p><strong>Role:</strong> {role || 'N/A'}</p> */}
        <p><strong>Bio:</strong> {profileData.bio || 'No bio yet.'}</p>
      </div>
    </div>
  );
};

export default ProfileModal;

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modal: {
    background: '#fff', padding: '2rem', borderRadius: '8px',
    maxWidth: '500px', width: '100%', position: 'relative'
  },
  image: {
    width: '150px', height: '150px', objectFit: 'cover',
    borderRadius: '50%', marginBottom: '1rem'
  },
  closeButton: {
    position: 'absolute', top: '40px', right: '10px', cursor: 'pointer', backgroundColor: 'red', border: 'none', color: 'white'
  }
};
