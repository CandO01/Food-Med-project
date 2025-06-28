// ForgotPassword.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function ForgotPassword() {
  const [forgot, setForgot] = useState({ email: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

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
        placeholder="Enter your email address"
        required
        />
      <button type="submit">Reset</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
    <Link className='create' to='/signup'>Create a new account</Link>
  </div>
  )
}

export default ForgotPassword
