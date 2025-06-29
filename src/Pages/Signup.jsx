import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Confetti from 'react-confetti'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  })

  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('signing-up')
    setMessage('')
    setError(null)

    try {
      const res = await fetch('https://foodmed-server.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      setSuccess(true)
      setMessage(data.message || 'Thank you for signing up successfully! Redirecting you to the login section')
      setStatus('done')
    // Delay 3 seconds before redirecting
      setTimeout(() => {
        navigate('/login')
      }, 4500)
     
    } catch (err) {
      setError(err.message)
      setStatus('failed')
    }
  }

 return (
    <div className="signup-form">
      <h1 className='heading-one'>{t('signup.heading')}</h1>

      {success && <Confetti />}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form className='signup-container' onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder={t('signup.fullName')}
          onChange={handleChange}
          value={form.name}
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t('signup.email')}
          onChange={handleChange}
          value={form.email}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={t('signup.password')}
          onChange={handleChange}
          value={form.password}
          required
        />
        <input
          type="password"
          name="confirm"
          placeholder={t('signup.confirm')}
          onChange={handleChange}
          value={form.confirm}
          required
        />

        <p className='have-account'>
          {t('signup.haveAccount')}<Link to="/login">{t('signup.login')}</Link>
        </p>

        <p className='terms-and-condi'>
          {t('signup.terms')} <span style={{fontWeight: 700}}>{t('signup.learnMore')}</span>
        </p>

        <button type="submit" disabled={status === 'signing-up'}>
          {status === 'signing-up' ? t('signup.signingUp') : t('signup.signup')}
        </button>
      </form>
    </div>
  )
}

export default Signup
