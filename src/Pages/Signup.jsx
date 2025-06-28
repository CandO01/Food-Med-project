import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Confetti from 'react-confetti'
import { useNavigate } from 'react-router-dom'
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
      const res = await fetch('http://localhost:5223/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      setSuccess(true)
      setMessage(data.message || 'Signup successful!')
      setStatus('done')
      navigate('/login') //redirecting to login page
    } catch (err) {
      setError(err.message)
      setStatus('failed')
    }
  }

  return (
    <div className="signup-form">
      <h1 className='heading-one'>Create an account with FoodMed</h1>

      {success && <Confetti />}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form className='signup-container' onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          onChange={handleChange}
          value={form.name}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
        />

        <input
          type="password"
          name="confirm"
          placeholder="Confirm password"
          onChange={handleChange}
          value={form.confirm}
          required
        />
        <p className='have-account'>
          Have an account? <Link to="/login">Log in</Link>
        </p>
        <p className='terms-and-condi'>By registering, you agree to all terms and conditions. <span style={{fontWeight: 700}}>Learn more.</span></p>
        <button type="submit" disabled={status === 'signing-up'}>
            {status === 'signing-up' ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}

export default Signup
