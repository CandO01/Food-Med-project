
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthenticationContext/Authcontext';
import foodmedImg from '../assets/foodmed1.png';
import { useTranslation } from 'react-i18next';

function Signin() {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const names = userName || 'Guest';

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) setUserName(savedName);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
      console.log("LOGIN RESPONSE:", data); 

      if (!res.ok) throw new Error(data.error || 'Login failed');

      // Login context
      login({
        _id: data.id || data.userId, //NB: initial is data.id if the above did not work return to this
        name: data.name,
        email: data.email,
        phone: data.phone,
        canDonate: data.canDonate || false,
        canRequest: data.canRequest || false,
        role: data.role,
        specialty: data.specialty || null,
        image: data.image || null
      });

          // ✅ Save key values in localStorage for later use
  //  localStorage.setItem('userId', data.id || data.userId);
  //   localStorage.setItem('userName', data.name);
  //   localStorage.setItem('userEmail', data.email);
  //   localStorage.setItem('userRole', data.role);

      // Redirect based on role
      if (data.role === 'doctor') {
        navigate('/medical');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  return (
    <div className="signin-form">
      <div className='foodmed'>
        <img src={foodmedImg} alt="food med logo" />
        <h1>FOODMED</h1>
      </div>

      <h1 style={{ color: 'black', fontSize:'1.6rem' }}>{t('signin.welcomeBack')} {names}</h1>

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
  );
}

export default Signin;
