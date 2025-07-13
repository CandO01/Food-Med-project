import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { CiMedicalCross } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { RiInformation2Line } from "react-icons/ri";
import { LocationContext } from '../LocationContext/LocationContext';
import { MdLocationPin } from "react-icons/md";
import menuIcon from '../assets/menu.png'
import { IoCartOutline } from "react-icons/io5";
import './FoodMedHomePage.css';

const FoodMedHomePage = () => {
  const [isSliding, setIsSliding] = useState(false);
  const { state, country } = React.useContext(LocationContext)
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
            <li onClick={() => navigate('/donor-profile')}>
              <FaRegUser style={{ marginRight: '8px', color: 'black' }} />
              Profile
            </li>
            <li onClick={() => navigate('/food-dashboard')}>
              <IoFastFoodOutline style={{ marginRight: '8px', color: 'black' }} />
              Food
            </li>
            <li onClick={() => navigate('/user-request')}>
              <IoCartOutline style={{ marginRight: '8px', color: 'black' }} />
              My food Request
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
            <img src={menuIcon} alt='Menu icon' style={{width: '18.5px', height: '14px'}} />
            Hello {name}!
          </div>
        </header>
        <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
          <MdLocationPin />
          <p style={{textAlign: 'start', margin: '1px'}}>{state}, {country}</p>
        </div>

        {isSliding && (
          <button className="cancel-button" onClick={handleCancelClick}>
            X
          </button>
        )}
        
        <div className="button-group">
          <button onClick={() => navigate('/food-form')} className="btn-orange">
            Add food
          </button>
          <button onClick={() => navigate('/chat')} className="btn-green">
            Ask a doctor
          </button>
           <button onClick={() => navigate('/food-dashboard')} className="btn-green">
            Find food nearby
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodMedHomePage;

