// ForgotPassword.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function ForgotPassword() {
  const [forgot, setForgot] = useState({ email: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation();

  function handlePassword(e) {
    const { name, value } = e.target
    setForgot(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function submitResetPassword(e) {
    e.preventDefault()
    try {
      const res = await fetch('https://foodmed-server.onrender.com/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forgot)
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      sessionStorage.setItem('resetEmail', forgot.email) // ✅ Store email
      setMessage(data.message)
      navigate('/verify-otp')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
  <div className="forget-password-container">
    <Link className='cancel-link' to='/login'>X</Link>
    <form onSubmit={submitResetPassword}>
      <input
        type="email"
        name="email"
        value={forgot.email}
        onChange={handlePassword}
        placeholder={t('forgotPassword.placeholder')}
        required
        />
      <button type="submit">{t('forgotPassword.reset')}</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
    <Link className='create' to='/signup'>{t('forgotPassword.createAccount')}</Link>
  </div>
  )
}

export default ForgotPassword
