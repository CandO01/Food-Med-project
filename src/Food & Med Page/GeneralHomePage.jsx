import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { CiLogout } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { CiMedicalCross } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { RiInformation2Line } from "react-icons/ri";
import './FoodMedHomePage.css';

const FoodMedHomePage = () => {
  const [isSliding, setIsSliding] = useState(false);
  const navigate = useNavigate();
 const name = localStorage.getItem('userName') || 'Guest'

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
            <li onClick={() => navigate('/donor-request-dashboard')}>
              <FaRegUser style={{ marginRight: '8px', color: 'black' }} />
              Profile
            </li>
            <li onClick={() => navigate('/food-dashboard')}>
              <IoFastFoodOutline style={{ marginRight: '8px', color: 'black' }} />
              Food
            </li>
            <li onClick={() => navigate('/medical')}>
              <CiMedicalCross style={{ marginRight: '8px', color: 'black' }} />
              Medical
            </li>
            <li onClick={() => navigate('/settings')}>
              <IoSettingsOutline style={{ marginRight: '8px', color: 'black' }} />
              Settings
            </li>
            <li onClick={() => navigate('/language')}>
              <RiInformation2Line style={{ marginRight: '8px', color: 'black' }} />
              About us
            </li>
            <li onClick={()=>navigate('/login')} style={{display:'flex', alignItems: 'center', position: 'absolute', bottom: '0px', left: '20px', right: '0px' }}>
              <CiLogout style={{ marginRight: '8px', fontSize: '24px', color:'black' }} />
              Logout
            </li>
          </ul>
        </div>
      )}

      {/* Main content */}
      <div className={`main-content ${isSliding ? 'slide-out' : ''}`}>
        <header className="foodmed-header">
          <div className="user-icon" onClick={handleUserClick}>
            <FaUser style={{color: 'black'}} />
            Hello {name}
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

