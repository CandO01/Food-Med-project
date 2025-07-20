import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Confetti from 'react-confetti'
import successIcon from '../assets/check1.gif'

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
        <img  src={successIcon} alt="congratulations icon" width={350} />
        <h1 style={{marginTop: -60}}>{t('congrats.message')}</h1>
        <p style={{marginTop: 0, fontSize: 18, color: 'green', fontWeight: 700}}>{t('congrats.account')}!!!</p>
        <button type='click' onClick={()=> navigate('/home')}>{t('congrats.nextPage')}</button>
      </div>
    </>
  )
}

export default Congratulations