import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Home() {
  const name = localStorage.getItem('userName') || 'Guest'
 const navigate = useNavigate()
 const { t } = useTranslation()
  return (
    <div className='welcome-message'>
      <h1>{t('home.hi')}, {name}!</h1>
      <p>{t('home.description')}</p>
      <button onClick={()=>navigate('/location')}>{t('home.button')}</button>
    </div>
  )
}

export default Home
