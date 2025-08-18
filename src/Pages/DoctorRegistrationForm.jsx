import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

function DoctorRegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    email: '',
    password: '',
    phone: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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

        if(imageFile){
          data.append('image', imageFile)
        }

        const res = await fetch('http://localhost:5223/doctors', {
          method: 'POST',
          body: data
        });

        const result = await res.json();

        if(res.ok){
         setMessage('You have successfully registered as a doctor');
         setFormData({ name: '', specialty: '', email: '', password: '', phone: '' });
         setImageFile(null)
         setTimeout(()=>navigate('/home'), 4000)
        }
        else{
          setMessage(result.error || 'Error registering doctor')
        }
      } catch (err) {
         setMessage('Error connecting to server')
      } finally{
        setLoading(false)
      }
  }

  return (
    <div className='doctor-form' style={{ maxWidth: 500, margin: 'auto' }}>
      <h1>Doctor Registration Form</h1>
      {message && <p>{message}</p>}
      <form className='doctor-form-container' onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Enter your full name"
          onChange={handleChange}
        />
        <input
          type="text"
          name="specialty"
          value={formData.specialty}
          placeholder="Enter your profession"
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          placeholder="Enter your phone number"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter your correct email address"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Enter your password"
          onChange={handleChange}
        />
        
        <input 
          type="file" 
          name="image" 
          accept="image/*" 
          onChange={handleFileChange} 
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
