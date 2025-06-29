import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Confetti from 'react-confetti'

function Congratulations() {

  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <>
      <Confetti />
      <div className='congratulations-container'>
        <h1>{t('congrats.message')}</h1>
        <button type='click' onClick={()=> navigate('/landing-page')}>{t('congrats.nextPage')}</button>
      </div>
    </>
  )
}

export default Congratulations