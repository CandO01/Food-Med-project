import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './SplashCarousel.css'
import splashLogo from '../assets/logo.png'

function SplashCarousel() {
  const [currentPage, setCurrentPage] = useState(0)
  const navigate = useNavigate()
  const intervalRef = useRef(null)

  // ✅ Moved pages array inside the component so navigate works
const pages = [
  {
    id: 1,
    content: (
      <div className='page-content'>
        <img style={{ width: 200 }} src={splashLogo} alt="splash foodmed logo" />
        <h1 style={{ margin: -30, fontSize: '2rem' }}>FoodMed</h1>
      </div>
    )
  },
  {
    id: 2,
    content: (
      <>
        <h1>Welcome to Connect and Care!</h1>
        <p>Connecting for food items, and medical help</p>
        <button className="skip-btn" onClick={() => navigate('/language')}>Skip</button>
      </>
    )
  },
  {
    id: 3,
    content: (
      <>
        <h1>Give what you can, get what you want</h1>
      </>
    )
  },
  {
    id: 4,
    content: (
      <>
        <h1>Access healthcare at your fingertips</h1>
        <p>Get in touch with qualified medical professionals and manage your health journey with ease</p>
        <button className="get-started-btn" onClick={() => navigate('/language')}>Get Started</button>
      </>
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
  }, [currentPage])

  const handleManual = (index) => {
    clearInterval(intervalRef.current)
    setCurrentPage(index)
  }

  return (
    <div className="carousel-container">
      <div className="carousel-page">
        {pages[currentPage].content}
      </div>
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
