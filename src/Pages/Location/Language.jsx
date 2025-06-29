import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Language() {
  const [language, setLanguage] = useState(localStorage.getItem('appLang') || '')
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  function handleLanguageChange(e) {
    const selectedLang = e.target.value
    setLanguage(selectedLang)
    localStorage.setItem('appLang', selectedLang)

    const langCode = selectedLang === 'english' ? 'en' : 'pidgin'
    i18n.changeLanguage(langCode)
  }

  return (
    <div className='language-container'>
      <h1 style={{fontSize: 25, marginBottom: 0}}>WELCOME TO FOODMED</h1>
      <p style={{fontSize: 22, fontWeight: 500}}>Please select preferred language</p>
      <div className="english-language">
        <label htmlFor="english" style={{fontSize: 20}}>English</label>
        <input 
          type="radio" 
          name="language"
          value="english"
          checked={language === 'english'}
          onChange={handleLanguageChange}
        />
      </div>

      <div className="pidgin-language">
        <label htmlFor="pidgin" style={{fontSize: 20}}>Pidgin</label>
        <input 
          type="radio" 
          name="language"
          value="pidgin"
          checked={language === 'pidgin'}
          onChange={handleLanguageChange}
        />
      </div>

      <button type='button' onClick={() => navigate('/signup')}>Next</button>
    </div>
  )
}

export default Language
