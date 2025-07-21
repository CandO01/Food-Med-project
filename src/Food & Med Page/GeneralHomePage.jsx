import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { IoFastFoodOutline, IoCartOutline, IoSettingsOutline } from "react-icons/io5";
import { FiUploadCloud } from "react-icons/fi";
import { CiMedicalCross } from "react-icons/ci";
import { RiInformation2Line } from "react-icons/ri";
import { LocationContext } from '../LocationContext/LocationContext';
import { MdLocationPin } from "react-icons/md";
import menuIcon from '../assets/menu.png';
import './FoodMedHomePage.css';
import garri from '../assets/garri.jpg';
import freshcorn from '../assets/freshcorn.jpg';
import plantain from '../assets/plantain.jpg';
import ripeplantain from '../assets/ripeplantain.jpg';
import bagrice from '../assets/bagrice.jpg';
import diabetes from '../assets/diabetes.png';
import eatWell from '../assets/eatwell.png';
import junkfood from '../assets/junkfood.jpg'
import healthyWeight from '../assets/healthyweight.png';
import musclebuilding from '../assets/musclebuilding.png';
import plentyrest from '../assets/plentyrest.png';
import smile from '../assets/smile.png';
import stopsmoking from '../assets/stopsmoking.png';


const foodItems = [
    {
      id: 1,
      food: 'Garri',
      images: garri,
      location: 'Ikeja, Lagos',
      mode: 'Trade'
    },
      {
      id: 2,
      food: 'Fresh corn',
      images: freshcorn,
      location: 'Egbeda akowonjo',
      mode: 'Request Now',
    },
      {
      id: 3,
      food: 'Plantain',
      images: plantain,
      location: 'Lagos Island',
      mode: 'Request Now',
    },
      {
      id: 4,
      food: 'Ripe plantain',
      images: ripeplantain,
      location: 'Surulere',
      mode: 'Request Now',
    },
      {
      id: 5,
      food: 'Bag of rice',
      images: bagrice,
      location: 'Bode thomas',
      mode: 'Trade',
    }
  ]


const FoodMedHomePage = () => {
  const [isSliding, setIsSliding] = useState(false);
  const { state, country } = React.useContext(LocationContext);
  const navigate = useNavigate();
  const name = localStorage.getItem('userName') || 'Guest';
  const [current, setCurrent] = useState(0);
  const length = foodItems.length;
  const intervalRef = useRef()
  const recipientId = localStorage.getItem('lastRecipientId');

  const handleUserClick = () => {
    setIsSliding(true);
  };

  const handleCancelClick = () => {
    setIsSliding(false);
  };

  // For food carousel 

  useEffect(()=>{
    intervalRef.current = setInterval(()=>{
      setCurrent(prev=>(prev + 1) % length)
    }, 5000)

    return ()=>{
      clearInterval(intervalRef.current)
    }
  }, [length])

  return (
    <div className="foodmed-container">
      
      {/* Sidebar now slides from the left */}
      <div className={`sidebar ${isSliding ? 'show-sidebar' : ''}`}>
        <button className="cancel-button" onClick={handleCancelClick}>X</button>
        <ul>
          <li onClick={() => navigate('/user-profile')}>
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
          <li onClick={() => navigate('/donor-profile')}>
            <FiUploadCloud style={{ marginRight: '8px', color: 'black' }} />
            Donor food profile
          </li>
          <li onClick={() => navigate('/medical')}>
            <CiMedicalCross style={{ marginRight: '8px', color: 'black' }} />
            Medical
          </li>
          <li onClick={() => navigate('/settings')}>
            <IoSettingsOutline style={{ marginRight: '8px', color: 'black' }} />
            Settings
          </li>
          <li onClick={() => navigate('/about-us')}>
            <RiInformation2Line style={{ marginRight: '8px', color: 'black' }} />
            About us
          </li>
          <li onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', position: 'absolute', bottom: '20px', left: '20px' }}>
            <CiLogout style={{ marginRight: '8px', fontSize: '24px', color: 'black' }} />
            Logout
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content">
        <header className="foodmed-header">
          <div className="user-icon" onClick={handleUserClick}>
            <img src={menuIcon} alt='Menu icon' style={{ width: '19px', height: '14px' }} />
            Hello {name}!
          </div>
        </header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MdLocationPin style={{ color: 'black' }} />
          <p style={{ textAlign: 'start', margin: '1px', color: 'black' }}>{state}, {country}</p>
        </div>

        <div className="button-group">
          <button onClick={() => navigate('/food-form')} className="btnHome btn-orange">
            Add food
          </button>
          <button onClick={() => navigate(`/chat/${recipientId}`)} className="btnHome btn-green">
            Ask a doctor
          </button>
          <button onClick={() => navigate('/food-dashboard')} className="btnHome btn-green">
            Find food nearby
          </button>
        </div>

        <h2 className='nearby-listing'>Nearby food listing</h2>
        <div className="carousel-wrapper" style={{ transform: `translateX(-${current * 100}%)` }}>
          {foodItems.map((item)=>{
            return(
              <div className="carousel-item" key={item.id}>
                <img src={item.images} alt="Food images" />
                <div className="food-info">
                  <p className="food-name">{item.food}</p>
                  <p className="food-location">{item.location}</p>
                  <button onClick={()=>navigate('/food-dashboard')} className="food-mode">{item.mode}</button>
                </div>
              </div>
            )
            })}
          </div>
         <h2 style={{color: 'orange', fontSize: '1.4rem', fontWeight: '600'}}>Health tips of the day</h2>
         <div className="health">
          <div className="healthyfood">
            <img src={smile} alt="smiley" />
            <p>Find reason to smile</p>
          </div>
          <div className="healthyfood">
            <img src={diabetes} alt="image for checking diabetes instrument" />
            <p>Check for diabetes</p>
          </div>
          <div className="healthyfood">
            <img src={musclebuilding} alt="man lifting weight" />
            <p>Build muscle</p>
          </div>
          <div className="healthyfood">
            <img src={plentyrest} alt="woman resting on the bed" />
            <p>Get plenty rest</p>
          </div>
          <div className="healthyfood">
            <img src={junkfood} alt="Junks" />
            <p>Reduce junk food</p>
          </div>
          <div className="healthyfood">
            <img src={eatWell} alt="Nutritious food" />
            <p>Eat well</p>
          </div>
          <div className="healthyfood">
            <img src={stopsmoking} alt="signage for stop smoking" />
            <p>Stop smoking</p>
          </div>
          <div className="healthyfood">
            <img src={healthyWeight} alt="weighing balance with fruits on it" />
            <p>Maintain your healthy weight</p>
          </div>

         </div>
        </div>
      </div>
  );
};

export default FoodMedHomePage;


