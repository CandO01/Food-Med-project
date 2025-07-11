import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ForgotPassword() {
  const [forgot, setForgot] = useState({ email: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  function handlePassword(e) {
    const { name, value } = e.target;
    setForgot(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function submitResetPassword(e) {
    e.preventDefault();
    try {
      const res = await fetch('https://foodmed-firstserver-backup.onrender.com/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forgot),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      sessionStorage.setItem('resetEmail', forgot.email);
      setMessage(data.message);
      navigate('/verify-otp');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="forget-password-container">
      <div style={forgotPasswordStyle.container}>
        <h2 style={forgotPasswordStyle.h2}>Forgot password</h2>
        <Link className="cancel-link" to="/login">X</Link>
      </div>

      <div style={forgotPasswordStyle.passwordh3}>
        <h3 style={{ color: '#FFA500', fontSize: '1.25rem', marginBottom: '2px' }}>Forgotten Password?</h3>
        <p style={{ marginTop: '0px', fontSize: '0.93rem' }}>{t('forgotPassword.text')}</p>
      </div>

      <form onSubmit={submitResetPassword}>
        <div className="form-group">
          <i className="fas fa-envelope icon"></i>
          <input
            type="email"
            name="email"
            id="email"
            value={forgot.email}
            onChange={handlePassword}
            required
          />
          <label htmlFor="email" className={forgot.email ? 'active' : ''}>
            {t('forgotPassword.placeholder')}
          </label>
        </div>
        <button type="submit">{t('forgotPassword.reset')}</button>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <Link className="create" to="/signup">{t('forgotPassword.createAccount')}</Link>
    </div>
  );
}

export default ForgotPassword;

const forgotPasswordStyle = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px 20px',
  },
  h2: {
    marginLeft: '75px',
  },
  passwordh3: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};
