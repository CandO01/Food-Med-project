import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

function DoctorRegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    email: '',
    password: '',
    phone: '',
    overview: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()
    const { t } = useTranslation()

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  function handleFileChange(e){
     setImageFile(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

      try {
        const data = new FormData();
        data.append('name', formData.name); 
        data.append('specialty', formData.specialty); 
        data.append('email', formData.email); 
        data.append('password', formData.password); 
        data.append('phone', formData.phone);
        data.append('overview', formData.overview);

        if(imageFile){
          data.append('image', imageFile)
        }

        const res = await fetch('https://foodmed-firstserver-backup.onrender.com/doctors', {
          method: 'POST',
          body: data
        });

        const result = await res.json();

        if(res.ok){
         setMessage('You have successfully registered as a doctor');
         setFormData({ name: '', specialty: '', email: '', password: '', phone: '', overview: '' });
         setImageFile(null)
         setTimeout(()=>navigate('/home'), 4000)
        }
        else{
          setMessage(result.error || 'Error registering doctor')
        }
      } catch (err) {
         setMessage('Error connecting to server')
         setError(err.message)
      } finally{
        setLoading(false)
      }
  }

  return (
    <div className='doctor-form' style={{ maxWidth: 500, margin: 'auto' }}>
      <h1 className='heading-one'>Doctor Registration Form</h1>
      {message && <p style={{color: 'green', fontSize: '18px', fontWeight: 600}}>{message}</p>}
      {error && <p style={{color: 'red', fontSize: '18px', fontWeight: 600}}>{error}</p>}
      <form className='doctor-form-container' onSubmit={handleSubmit}>
        <label>Full name:</label>
        <input
          className='input'
          type="text"
          name="name"
          value={formData.name}
          placeholder="Dr Matthew O"
          onChange={handleChange}
          required
        />
        <label>Area of specialist:</label>
        <input
          className='input'
          type="text"
          name="specialty"
          value={formData.specialty}
          placeholder="E.g Brain specialist"
          onChange={handleChange}
          required
        />
        <label>Phone Number:</label>
        <input
          className='input'
          type="tel"
          name="phone"
          value={formData.phone}
          placeholder="+234*****678"
          onChange={handleChange}
          required
        />
        <label>Email address:</label>
        <input
          className='input'
          type="email"
          name="email"
          value={formData.email}
          placeholder="example@gmail.com"
          onChange={handleChange}
          required
        />
        <label>Password:</label>
        <input
          className='input'
          type="password"
          name="password"
          value={formData.password}
          placeholder="@12thegdth"
          onChange={handleChange}
          required
        />
        <label>Overview / Bio</label>
        <textarea
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            placeholder="Tell us about your experience, background, and hospitals you worked with"
            required
            style={{
                  width: "100%",   // takes full width of form
                  height: "120px", // taller height for more text
                  padding: "10px",
                  fontFamily: 'Inter',
                  fontSize: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  resize: "vertical" // allows user to resize only vertically
                }}
        />

        <label>Profile image</label>
        <input 
          type="file" 
          name="image" 
          accept="image/*" 
          onChange={handleFileChange}
          required
          style={{fontSize: '1rem'}}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </form>
       <p className='have-account'>
          {t('signup.haveAccount')} <Link to="/login">{t('signup.login')}</Link>
      </p>
    </div>
  );
}

export default DoctorRegistrationForm;
