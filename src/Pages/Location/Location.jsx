import React, { useState, useEffect } from 'react'
import { CiSearch } from "react-icons/ci"
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LocationMap from './MapLocation'

function Location() {
  const [location, setLocation] = useState({ country: '' })
 const navigate = useNavigate()

 const { t } = useTranslation()
  function handleChange(e) {
    const { name, value } = e.target
    setLocation(prev => ({
      ...prev,
      [name]: value
    }))
  }

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
      <LocationMap />
      <button style={{ marginTop: '20px' }} onClick={()=>navigate('/congratulations')}>
        {t('location.setLocationBtn')}
      </button>
    </div>
  )
}

export default Location
