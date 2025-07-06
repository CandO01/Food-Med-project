import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import './FoodMedHomePage.css';
import { AuthContext } from '../AuthenticationContext/Authcontext';

const FoodMedHomePage = () => {
  const [isSliding, setIsSliding] = useState(false);
  const navigate = useNavigate();
  const {logout } = React.useContext(AuthContext);

  const handleUserClick = () => {
    setIsSliding(true);
  };

  const handleCancelClick = () => {
    setIsSliding(false);
  };

  return (
    <div className="foodmed-container">
      {/* Static hidden sidebar */}
      {isSliding && (
        <div className="sidebar">
          <ul>
            <li onClick={() => navigate('/donor-request-dashboard')}>Profile</li>
            <li onClick={() => navigate('/food-dashboard')}>Food</li>
            <li onClick={() => navigate('/medical')}>Medical</li>
            <li onClick={() => navigate('/settings')}>Settings</li>
            <li onClick={() => navigate('/language')}>Change Language</li>
            <li onClick={logout}>Logout</li>
          </ul>
        </div>
      )}

      {/* Main content */}
      <div className={`main-content ${isSliding ? 'slide-out' : ''}`}>
        <header className="foodmed-header">
          <div className="user-icon" onClick={handleUserClick}>
            <FaUser />
          </div>
          <div className="logo">FoodMed</div>
        </header>

        {isSliding && (
          <button className="cancel-button" onClick={handleCancelClick}>
            X
          </button>
        )}

        <h2>Welcome to FoodMed</h2>
        <p>
          Bridging the gap between food donation and medical care — because everyone deserves good food and good health.
        </p>
        <div className="button-group">
          <button onClick={() => navigate('/food-dashboard')} className="btn-orange">
            Go to Food Home
          </button>
          <button onClick={() => navigate('/medical')} className="btn-green">
            Go to Medical Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodMedHomePage;

