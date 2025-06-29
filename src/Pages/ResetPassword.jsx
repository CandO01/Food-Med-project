// ResetPassword.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import { useTranslation } from 'react-i18next';

function ResetPassword() {
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const email = sessionStorage.getItem('resetEmail') // ✅ Load email

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await fetch('https://foodmed-server.onrender.com/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email })
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setMessage(data.message)
      sessionStorage.removeItem('resetEmail') // ✅ Clear email
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
    <div className="icon">
      <Link to='/verify-otp'><IoArrowBack className='arrow-back' /></Link>
      <Link className='cancel-otp' to='/forgot-password'>X</Link>
    </div>
    <form className="reset-form" onSubmit={handleSubmit}>
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="New Password"
        required
        />
      <input
        type="password"
        name="confirm"
        value={form.confirm}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
        />
      <button type="submit" onClick={()=>navigate('/home')}>Continue</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  </>

  )
}

export default ResetPassword
