import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../AuthenticationContext/Authcontext'
import foodmedImg from '../assets/foodmed1.png'

function Signin() {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [userName, setUserName] = useState('')
  const { login } = React.useContext(AuthContext)
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('logging')
    setError(null)

    try {
      const res = await fetch('https://foodmed-server.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Please enter valid credentials')
      }

      setUserName(data.name)
      login({ name: data.name, email: data.email })
      navigate('/home')
    } catch (error) {
      setError(error.message)
      setStatus('idle')
    }
  }

  return (
    <div className="signin-form">
      <div className='foodmed'>
        <img src={foodmedImg} alt="food med logo" />
        <h1>FOODMED</h1>
      </div>

      <h1>Welcome back {userName || '!'}</h1>

      {/* Show error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form className='signin-container' onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          onChange={handleChange}
          value={loginForm.email}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          onChange={handleChange}
          value={loginForm.password}
          required
        />

        <button type="submit" disabled={status === 'logging'}>
          {status === 'logging' ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div className="forgot-password">
        <Link to='/forgot-password'>Forgot password?</Link>
        <p>Not {userName}? <span>Switch account</span></p>
      </div>
    </div>
  )
}

export default Signin
