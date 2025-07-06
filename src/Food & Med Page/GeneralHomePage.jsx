import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';
import './FoodMedHomePage.css';

const FoodMedHomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="foodmed-container">
      <header className="foodmed-header">
        <h1 className="logo">FoodMed</h1>
        <button onClick={toggleMenu} className="menu-icon">
          {isMenuOpen ? <MdClose /> : <FaBars />}
        </button>
        <nav className="nav-links">
          <button onClick={() => navigate('food-dashboard')} className="btn-orange">Food Home</button>
          <button onClick={() => navigate('medical')} className="btn-green">Medical Home</button>
        </nav>
      </header>

      {isMenuOpen && (
        <motion.div 
          initial={{ x: '-100%' }} 
          animate={{ x: 0 }} 
          exit={{ x: '-100%' }}
          className="sidebar"
        >
          <h2>Dashboard</h2>
          <ul>
            <li>Overview</li>
            <li><Link to='/food-dashboard'>Requests</Link></li>
            <li><Link to='/food-form'>Donors</Link></li>
            <li><Link to='/medical-records'>Medical Records</Link></li>
            <li><Link to='/settings'>Settings</Link></li>
          </ul>
        </motion.div>
      )}

      <main className="main-content">
        <h2>Welcome to FoodMed</h2>
        <p>Bridging the gap between food donation and medical care — because everyone deserves good food and good health.</p>
        <div className="button-group">
          <button onClick={() => navigate('/food-dashboard')} className="btn-orange">Go to Food Home</button>
          <button onClick={() => navigate('/medical')} className="btn-green">Go to Medical Home</button>
        </div>
      </main>
    </div>
  );
};

export default FoodMedHomePage;
