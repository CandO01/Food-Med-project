import React, { useState, useEffect } from 'react'
import { CiSearch } from "react-icons/ci"
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Location() {
  const [location, setLocation] = useState({ country: '' })
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null })
  const [map, setMap] = useState(null)
 const navigate = useNavigate()

 const { t } = useTranslation()
  function handleChange(e) {
    const { name, value } = e.target
    setLocation(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Automatically get user location and load the map
  useEffect(() => {
    if (window.google && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setUserLocation({ lat, lng })

        const mapObj = new window.google.maps.Map(document.getElementById('map'), {
          center: { lat, lng },
          zoom: 12
        })

        new window.google.maps.Marker({
          position: { lat, lng },
          map: mapObj,
          title: "You are here"
        })

        setMap(mapObj)
      }, (err) => {
        console.error('Geolocation error:', err)
      })
    }
  }, [])

  return (
    <div className='location-container'>
      <h1>{t('location.heading')}</h1>
      <div className="search-field">
        <CiSearch className='icon' />
        <input
          type="search"
          name="country"
          placeholder={t('location.searchPlaceholder')}
          value={location.country}
          onChange={handleChange}
        />
      </div>

      <div id="map" className="map-placeholder" style={{ height: '400px', marginTop: '20px'}}>
        {/* Google Map will show here */}
      </div>

      <button style={{ marginTop: '20px' }} onClick={()=>navigate('/congratulations')}>
        {t('location.setLocationBtn')}
      </button>
    </div>
  )
}

export default Location
