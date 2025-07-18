import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

function ResetPassword() {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirm, setShowConfirm] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const email = sessionStorage.getItem('resetEmail');

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setButtonClicked(true);

    try {
      const res = await fetch('https://foodmed-firstserver-backup.onrender.com/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setMessage(data.message);
      sessionStorage.removeItem('resetEmail');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => setButtonClicked(false), 300); // Reset animation state
    }
  }

  const isDisabled = !form.password || !form.confirm || form.password !== form.confirm;

  return (
    <div className='new-password-container'>
      <div className="icons">
        <Link to='/verify-otp' style={{ color: 'black' }}><IoArrowBack className='arrow-back' /></Link>
        <h2 style={{color: 'black'}}>Reset Password</h2>
        <Link className='cancel-otp' to='/forgot-password' style={{ color: 'black' }}>X</Link>
      </div>

      <h3 style={{ textAlign: 'center', margin: '20px 0', color: 'black' }}>Enter New Password</h3>

      <form className="reset-form" onSubmit={handleSubmit}>
        {/* Password Field */}
        <div className="form-group2">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <label className={form.password ? 'active' : ''}>New Password</label>
          <span
            className={`toggle-icon ${showPassword ? 'showing' : 'hiding'}`}
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password Field */}
        <div className="form-group2">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            required
          />
          <label className={form.confirm ? 'active' : ''}>Confirm Password</label>
          <span
            className={`toggle-icon ${showConfirm ? 'showing' : 'hiding'}`}
            onClick={() => setShowConfirm(prev => !prev)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          style={{
            opacity: isDisabled ? 0.6 : 1,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transform: buttonClicked ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}
        >
          Continue
        </button>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;


// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { IoArrowBack } from "react-icons/io5";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useTranslation } from 'react-i18next';

// function ResetPassword() {
//   const [form, setForm] = useState({ password: '', confirm: '' });
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [showPassword, setShowPassword] = useState(true);
//   const [showConfirm, setShowConfirm] = useState(true);
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const email = sessionStorage.getItem('resetEmail');

//   useEffect(() => {
//     if (!email) {
//       navigate('/forgot-password');
//     }
//   }, [email, navigate]);

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     try {
//       const res = await fetch('https://foodmed-firstserver-backup.onrender.com/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...form, email })
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error);
//       }

//       setMessage(data.message);
//       sessionStorage.removeItem('resetEmail');
//       navigate('/login');
//     } catch (err) {
//       setError(err.message);
//     }
//   }

//   return (
//     <div className='new-password-container'>
//       <div className="icons">
//         <Link to='/verify-otp' style={{color: '#ffff'}}><IoArrowBack className='arrow-back' /></Link>
//         <h2>Reset Password</h2>
//         <Link className='cancel-otp' to='/forgot-password' style={{color:'white'}}>X</Link>
//       </div>
//         <h3 style={{ textAlign: 'center', margin: '20px 0', color:'#FFFF' }}>Enter New Password</h3>
//       <form className="reset-form" onSubmit={handleSubmit}>
//         {/* Password Field */}
//         <div className="form-group2">
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             required
//           />
//           <label className={form.password ? 'active' : ''}>New Password</label>
//           <span
//             className={`toggle-icon ${showPassword ? 'showing' : 'hiding'}`}
//             onClick={() => setShowPassword(prev => !prev)}
//           >
//             {showPassword ? <FaEyeSlash /> : <FaEye />}
//           </span>
//         </div>

//         {/* Confirm Password Field */}
//         <div className="form-group2">
//           <input
//             type={showConfirm ? "text" : "password"}
//             name="confirm"
//             value={form.confirm}
//             onChange={handleChange}
//             required
//           />
//           <label className={form.confirm ? 'active' : ''}>Confirm Password</label>
//           <span
//             className={`toggle-icon ${showConfirm ? 'showing' : 'hiding'}`}
//             onClick={() => setShowConfirm(prev => !prev)}
//           >
//             {showConfirm ? <FaEyeSlash /> : <FaEye />}
//           </span>
//         </div>

//         <button type="submit" onClick={() => navigate('/home')}>Continue</button>
//         {message && <p style={{ color: 'green' }}>{message}</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//       </form>
//     </div>
//   );
// }

// export default ResetPassword;
