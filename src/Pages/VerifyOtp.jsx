import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function VerifyOTP({ email: propEmail, onVerified }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState(null)
  const [resendMsg, setResendMsg] = useState(null)
  const inputsRef = useRef([])
  const navigate = useNavigate()

  const email = propEmail || sessionStorage.getItem('resetEmail')

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fullOtp = otp.join('')
    setError(null)
    setResendMsg(null)

    try {
      const res = await fetch('https://foodmed-server.onrender.com/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: fullOtp })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      if (onVerified) {
        onVerified(email)
      } else {
        navigate('/reset-password')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const resendOTP = async () => {
    setError(null)
    setResendMsg(null)
    try {
      const res = await fetch('https://foodmed-server.onrender.com/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setResendMsg('OTP resent successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="verify-form">
      <p className="info-text">An OTP has been sent to your email. Please input the OTP:</p>

      <div className="otp-boxes">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            ref={(el) => (inputsRef.current[idx] = el)}
            className="otp-input"
          />
        ))}
      </div>

      <p className="resend" onClick={resendOTP}>Resend OTP</p>

      <button className="verify-btn" type="submit">Verify</button>

      {resendMsg && <p className="info-text" style={{ color: 'green' }}>{resendMsg}</p>}
      {error && <p className="error-text">{error}</p>}
    </form>
  )
}

export default VerifyOTP
