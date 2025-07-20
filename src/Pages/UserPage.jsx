import React, { useEffect, useState } from 'react';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const email = localStorage.getItem('userEmail'); // or 'donorEmail'

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://foodmed-firstserver-backup.onrender.com/user-profile?email=${email}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Something went wrong');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      }
    };

    if (email) {
      fetchProfile();
    } else {
      setError('No email found in localStorage.');
    }
  }, [email]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , maxWidth: '600px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px',  }}>
      <h2>User Profile</h2>
      {profile.profileImage && (
        <img
          src={profile.profileImage}
          alt="Profile"
          style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%', marginBottom: '30px' }}
        />
      )}
      <p style={styles.userprofile}><strong>Name:</strong> {profile.name}</p>
      <p style={styles.userprofile}><strong>Email:</strong> {profile.email}</p>
      <p style={styles.userprofile}><strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
      <p style={styles.userprofile}><strong>Location:</strong> {profile.location || 'Not provided'}</p>
      <p style={styles.userprofile}><strong>Role:</strong> {profile.role || 'N/A'}</p>
      <p style={styles.userprofile}><strong>Bio:</strong> {profile.bio || 'No bio yet.'}</p>
    </div>
  );
};

export default UserProfile;

const styles ={
  userprofile:{
    alignSelf: 'flex-start',
    margin: '10px'
  }
}