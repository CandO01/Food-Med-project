import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RolesPage() {
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('')
  const navigate = useNavigate();

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) {
      setMessage('Please select a role')
      return;
    }
    
    // Save role so Language page knows where to go after
    localStorage.setItem('selectedRole', role);
    navigate('/language');
  };
  
  return (
    <div className='role-form'>
      <h1 className='heading-one'>Welcome to FoodMed App</h1>
      <p style={{fontSize: '1.3rem', fontWeight: 400, color: 'black', marginTop: 6}}>Please select your role?</p>
      <form className='role-form-container' onSubmit={handleSubmit}>
        <label style={{marginRight: 5}}>Doctor</label>
        <input
            type="radio"
            name="role"
            value="doctor"
            checked={role === 'doctor'}
            onChange={(e) => setRole(e.target.value)}
          />

        <label style={{ marginLeft: '20px', marginRight: 5 }}>General User</label>
        <input
            type="radio"
            name="role"
            value="user"
            checked={role === 'user'}
            onChange={(e) => setRole(e.target.value)}
          />
          <p style={{color: 'red', margin: '10px, 0'}}>{message}</p>

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default RolesPage;
