import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RolesPage() {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) {
      alert('Please select a role first!');
      return;
    }

    // Save role so Language page knows where to go after
    localStorage.setItem('selectedRole', role);
    navigate('/language');
  };

  return (
    <div className='role-form'>
      <h1 className='heading-one'>Welcome to FoodMed App</h1>
      <p style={{fontSize: '1.3rem', fontWeight: 400, color: 'black'}}>Please select your role?</p>
      <form className='role-form-container' onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            name="role"
            value="doctor"
            checked={role === 'doctor'}
            onChange={(e) => setRole(e.target.value)}
          />
          Doctor
        </label>

        <label style={{ marginLeft: '15px' }}>
          <input
            type="radio"
            name="role"
            value="user"
            checked={role === 'user'}
            onChange={(e) => setRole(e.target.value)}
          />
          General User
        </label>

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default RolesPage;
