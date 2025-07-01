import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion' 
import './SplashCarousel.css'
import splashLogo from '../assets/logo.png'
// background images
import bg2 from '../assets/bg2.png'
import bg3 from '../assets/bg3.png'
import bg4 from '../assets/bg4.png'

function SplashCarousel() {
  const [currentPage, setCurrentPage] = useState(0)
  const navigate = useNavigate()
  const intervalRef = useRef(null)

  const animationVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  }

  const pages = [
    {
      id: 1,
      content: (
        <div className='page-content' style={{
          height: '100vh', width: '100vw',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <img style={{ width: 200 }} src={splashLogo} alt="splash foodmed logo" />
          <h1 style={{ margin: -30, fontSize: '2rem' }}>FoodMed</h1>
        </div>
      )
    },
    {
      id: 2,
      content: (
        <div style={{
          backgroundImage: `url(${bg2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100vw',
          padding: '2rem',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'end',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1>Welcome to Connect and Care!</h1>
          <p style={{ margin: '0 0 30px 0' }}>Connecting for food items, and medical help</p>
          <button className="skip-btn" onClick={() => navigate('/language')}>Skip</button>
        </div>
      )
    },
    {
      id: 3,
      content: (
        <div style={{
          backgroundImage: `url(${bg3})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100vw',
          padding: '2rem',
          color: 'black',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'end',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1>Give what you can, get what you want</h1>
          <button className="skip-btn" onClick={() => navigate('/language')}>Skip</button>
        </div>
      )
    },
    {
      id: 4,
      content: (
        <div style={{
          backgroundImage: `url(${bg4})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100vw',
          padding: '2rem',
          color: 'black',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'end',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1>Access healthcare at your fingertips</h1>
          <p style={{ fontWeight: 700 }}>Get in touch with qualified medical professionals and manage your health journey with ease</p>
          <button className="get-started-btn" onClick={() => navigate('/language')}>Get Started</button>
        </div>
      )
    },
  ]

  useEffect(() => {
    if (currentPage < pages.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentPage(prevPage => prevPage + 1)
      }, 3000)
    }
    return () => clearInterval(intervalRef.current)
  }, [currentPage]);

  const handleManual = (index) => {
    clearInterval(intervalRef.current)
    setCurrentPage(index)
  }

  return (
    <div className="carousel-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          className="carousel-page"
          variants={animationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.6 }}
        >
          {pages[currentPage].content}
        </motion.div>
      </AnimatePresence>

      <div className="carousel-indicators">
        {pages.map((page, index) => (
          <button
            key={page.id}
            className={`dot ${currentPage === index ? 'active' : ''}`}
            onClick={() => handleManual(index)}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default SplashCarousel
