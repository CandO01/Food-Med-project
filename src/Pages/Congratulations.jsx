import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Confetti from 'react-confetti'

function Congratulations() {
 const [showConfetti, setShowConfetti] = useState(false)
  useEffect(()=>{
    const timer = setTimeout(()=>{
      setShowConfetti(true)
    }, 1000)

    const stopTimer = setTimeout(()=>{
      setShowConfetti(false)
    }, 10000)

    return(()=>{
      clearTimeout(timer)
      clearTimeout(stopTimer)
    })
  }, [])

  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <>
      {showConfetti && <Confetti />}
      <div className='congratulations-container'>
        <h1>{t('congrats.message')}</h1>
        <p style={{marginTop: 0, fontSize: 18, color: 'green', fontWeight: 700}}>{t('congrats.account')}</p>
        <button type='click' onClick={()=> navigate('/landing-page')}>{t('congrats.nextPage')}</button>
      </div>
    </>
  )
}

export default Congratulations