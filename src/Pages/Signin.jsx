import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../AuthenticationContext/Authcontext'
import foodmedImg from '../assets/foodmed1.png'
import { useTranslation } from 'react-i18next'

function Signin() {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [userName, setUserName] = useState('')
  const { login } = React.useContext(AuthContext)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const names = userName || 'Guest'

  // Load saved username from localStorage if available
  useEffect(() => {
    const savedName = localStorage.getItem('userName')
    if (savedName) {
      setUserName(savedName)
    }
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

    async function handleSubmit(e) {
    e.preventDefault();
    setStatus('logging-in');
    setError('');

    try {
      const res = await fetch('https://foodmed-firstserver-backup.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login({
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone
      });
      
      localStorage.setItem('donorId', data.email);

      navigate('/home');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  }

  return (
    <div className="signin-form">
      <div className='foodmed'>
        <img src={foodmedImg} alt="food med logo" />
        <h1>FOODMED</h1>
      </div>

      <h1 style={{color: '#FFFFF'}}>{t('signin.welcomeBack')} {names}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form className='signin-container' onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder={t('signin.email')}
          onChange={handleChange}
          value={loginForm.email}
          required
        />

        <input
          type="password"
          name="password"
          placeholder={t('signin.password')}
          onChange={handleChange}
          value={loginForm.password}
          required
        />

        <button type="submit" disabled={status === 'logging-in'}>
          {status === 'logging-in' ? t('signin.loggingIn') : t('signin.login')}
        </button>
      </form>

      <div className="forgot-password">
        <Link to='/forgot-password'>{t('signin.forgotPassword')}</Link>

        <p><Link to='/signup'>{t('signin.asking')} {names}? {t('signin.switchAccount')}</Link></p>
      </div>
    </div>
  )
}

export default Signin
